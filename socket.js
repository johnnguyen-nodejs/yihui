const R = require("ramda")
const {encId, decId, getId} = require('./auth')
const DB = require('./db')
const db = new DB()
const path = require("path")
const fsExtra = require("fs-extra")
const {v4: uuidv4} = require("uuid")

function random(min, max) {
    return Math.random() * (max - min) + min
}

module.exports = (io,siofu) => {
    
    // io.set('origins', `${process.env.host}:${process.env.http_port || process.env.PORT}`)
    io.on('connection', (socket)=>{
        //upload file 
        const uploader = new siofu();
        uploader.dir = path.join(__dirname, "public/assets/uploads");
        uploader.listen(socket);
        // Do something when a file is saved:
        uploader.on("start", async (e)=>{
            var filename = Date.now() + "-" + e.file.name;
            e.file.name = filename;
        })
        socket.on("uploading_avatar", async data =>{
            const id = decId(getId(socket, 'socket'))
            await db.user({id:id}, {
                "info.status_upload": data
            })
        })
        socket.on("uploading_kyc", async data =>{
            const id = decId(getId(socket, 'socket'))
            await db.user({id:id}, {
                "info.status_upload": data
            })
        })
        uploader.on("saved", async (event)=>{
            const id = decId(getId(socket, 'socket'))
            var status = await db.user({id:id}, "info.status_upload")
            status = status[0].info.status_upload
            const fileName = event.file.name
            if(status === "avatar"){
                const oldImg = await db.user({id:id}, "info.avatar")
                const oldImgPath = path.join(__dirname, `public/assets/avatars/${oldImg[0].info.avatar}`)
                await db.user({id:id}, {
                    "info.avatar": fileName
                })
                await fsExtra.remove(oldImgPath)
                await db.user({id:id}, {
                    "info.status_upload": ""
                })
                socket.emit("upload_avatar_success", fileName)
            }
            if(status === "kyc"){
                var failNo = Math.floor((Math.random() * 20) + 1);
                await db.user({id:id}, {$push: {"info.kyc_img": fileName}})
                var noKyc = await db.user({id:id}, "info.kyc_img info.finance_fund")
                var nost = noKyc[0].info.kyc_img.length
                await db.user({id:id}, {
                    "info.status_upload": ""
                })
                if( failNo === 4 || failNo === 11 || failNo === 18){
                    noKyc[0].info.kyc_img.forEach(async (item)=>{
                        await db.user({id:id}, {$pull: {"info.kyc_img": item}})
                        const imgpPath = path.join(__dirname, `public/assets/avatars/${item}`)
                        await fsExtra.remove(imgpPath)
                    })
                    noKyc[0].info.finance_fund.forEach(async (item)=>{
                        await db.user({id:id}, {$pull: {"info.finance_fund": {"balance": {$gte: 0}}}})
                    })
                    socket.emit("upload_kyc_faile", nost)
                } else {                   
                    
                    socket.emit("upload_kyc_success", nost)
                }
                
            }  
        });
        socket.on("kyc_complete", async data=>{
            const id = decId(getId(socket, 'socket'))
            await db.user({id:id}, {"info.kyc": data})
        })

        // Error handler:
        uploader.on("error", function(event){
            console.log("Error from uploader", event);
        });

        //Login
        socket.on('check_email_login', async (data) => {
            var email = data.email
            var hash_md5 = data.hash_password
            var user = await db.user({'info.email': email},'info.email info.hash_password authen.login authen.select message secure.google')
            if (user.length == 0){
                socket.emit('exist_login_email', '* Email address or password is incorrect')
            } else {
                const hash_password = user[0].info.hash_password
                if (hash_md5 == decId(hash_password)){
                    var login = user[0].authen.login
                    var select = user[0].authen.select
                    var secret = user[0].secure.google
                    if (login){
                        if (select == 'google') {
                            socket.emit('exist_login_email', ' ')
                            socket.emit('require_tfa', '* Find your verification code in Google Authenticator')
                        } else {
                            // var id_message = (user[0].message)[select].id
                            // message(select, id_message, '2FA', gg.token(secret))
                            //message(app, id, event, content)
                            socket.emit('exist_login_email', ' ')
                            socket.emit('require_tfa', `* We have sent the verification code to your ${select}`)
                        }
                    } else {
                        socket.emit('exist_login_email', '')
                    }
                } else {
                    socket.emit('exist_login_email', '* Email address or password is incorrect')
                }
            }
        })
    })
}