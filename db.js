const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/yihui',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
// mongoose.connect('mongodb://admin:digigomongo@localhost/digigo',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const schemaUser = new Schema({
    role: {type: String, default: 'user'},
    // Thông tin cá nhân
    info: {
        first_name: {type: String, default: null},
        last_name: {type: String, default: null},
        email: {type: String, default: null},
        hash_password: {type: String, default: null},
        kyc: {type: Boolean, default: false},
        kyc_img: [{ type: String,default: null }],
        job: {type: String, default: null},
        mobile: {type: String, default: null},
        address: {type: String, default: null},
        about: {type: String, default: null},
        country: {type: String, default: null},
        city: {type: String, default: null},
        gender: {type: String, default: "male"},
        birthday: {type: Date, default: Date.now},
        avatar: {type: String, default: null},
        status_upload: {type:String, default: ""},
        finance_total: {type: Number, default: 0 },
        finance_fund: [{
            name: {type: String, default: null},
            balance: {type: Number, default: 0},
            scale: {type: Number, default: 0}
        }],
        finance_history: [{
            hisId: {type: String, default: null},
            type: {type: String, default: null},
            title: {type:String, default: null},
            value: {type:Number, default: 0},
            date: {type: Date, default: Date.now}
        }],
        helper_array:[{
            helperId: {type:String, default: null},
            sub: {type:String, default: null},
            details: {type:String, default: null},
            status_handle: {type: Boolean, default: false}
        }],
        notification: [{
            notiId: {type:String, default: null},
            sub: {type:String, default: null},
            type: {type:String, default: null},
            content: {type:String, default: null},
            status: {type: Boolean, default: false},
            times: {type: Date, default: Date.now}
        }]
    },

},{
    versionKey: false
})

const User = mongoose.model('User', schemaUser,'users')
const schemaPaper = new Schema({
    newsId: {type: String, default: null},
    sub: {type: String, default: null},
    content: {type: String, default: null},
    description: {type: String, default: null},
    background: {type: String, default: null},
    img: {type: String, default: null},
    writer: {type: String, default: null},
    timestamp: {type: Date, default: Date.now}
})

const Paper = mongoose.model('Paper', schemaPaper,'papers')


class DB{
    constructor(){
        this.User = User
        this.Paper = Paper
    }
    user = async (filter,  updater) =>{
        if (typeof updater === 'object'){
            return await this.User.findOneAndUpdate(filter,updater,{new:true})
        }
        if (typeof updater === 'string'){
            if (updater === ''){
                return await this.User.find(filter)
            } else {
                return await this.User.find(filter, updater)
            }
        }
        if (typeof updater === 'undefined'){
            const doc = new this.User(filter)
            return await doc.save()
        }
    }
    paper = async (filter,  updater) =>{
        if (typeof updater === 'object'){
            return await this.Paper.findOneAndUpdate(filter,updater,{new:true})
        }
        if (typeof updater === 'string'){
            if (updater === ''){
                return await this.Paper.find(filter)
            } else {
                return await this.Paper.find(filter, updater)
            }
        }
        if (typeof updater === 'undefined'){
            const doc = new this.Paper(filter)
            return await doc.save()
        }
    }
}

module.exports = DB