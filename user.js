require('dotenv').config()
const R = require('ramda')
const DB = require('./db')
const db = new DB()
const {encId, decId, getId} = require('./auth')
const fsExtra = require('fs-extra')
const path = require('path')

function random(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0)
}

module.exports = (app) => {

    app.get('/logout', async (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/login')
        })
    })


    //home routes
    app.get('/', async (req, res) => {
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('index', { 
                title: "YIHUI VN | Trang Chủ ",
                userInfo: user[0].info
             })
        } else {
            res.render('index', { 
                title: "YIHUI VN | Trang Chủ ",
                userInfo: null
             })
        }
    })
    app.get('/about', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('about', { 
                title: "DIGIGO | About Us ",
                userInfo: user[0].info
             })
        } else {
            res.render('about', { 
                title: "DIGIGO | About Us ",
                userInfo: null
             })
        }
    })
    app.get('/about/history', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('about-history', { 
                title: "YIHUI VN | Lịch Sử Hình Thành ",
                userInfo: user[0].info
             })
        } else {
            res.render('about-history', { 
                title: "YIHUI VN | Lịch Sử Hình Thành ",
                userInfo: null
             })
        }
    })
    app.get('/about/activities', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('about-activities', { 
                title: "YIHUI VN | Hoạt Dộng ",
                userInfo: user[0].info
             })
        } else {
            res.render('about-activities', { 
                title: "YIHUI VN | Hoạt Dộng ",
                userInfo: null
             })
        }
    })
    app.get('/about/partner', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('about-partner', { 
                title: "YIHUI VN | Đối Tác ",
                userInfo: user[0].info
             })
        } else {
            res.render('about-partner', { 
                title: "YIHUI VN | Đối Tác ",
                userInfo: null
             })
        }
    })
    app.get('/help', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('home/company/help', { 
                title: "DIGIGO | Help Center",
                userInfo: user[0].info
             })
        } else {
            res.render('home/company/help', { 
                title: "DIGIGO | Help Center",
                userInfo: null
             })
        }
    })
    app.get('/service', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('service', { 
                title: "YIHUI VN | Dịch Vụ  ",
                userInfo: user[0].info
             })
        } else {
            res.render('service', { 
                title: "YIHUI VN | Dịch Vụ  ",
                userInfo: null
             })
        }
    })
    app.get('/certificate', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('certificate', { 
                title: "YIHUI VN | Chứng Chỉ ",
                userInfo: user[0].info
             })
        } else {
            res.render('certificate', { 
                title: "YIHUI VN | Chứng Chỉ ",
                userInfo: null
             })
        }
    })
    app.get('/certificate/products', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('certificate-products', { 
                title: "YIHUI VN | Chứng Chỉ Sản Phẩm ",
                userInfo: user[0].info
             })
        } else {
            res.render('certificate-products', { 
                title: "YIHUI VN | Chứng Chỉ Sản Phẩm ",
                userInfo: null
             })
        }
    })

    //video routes
    app.get('/video', async (req, res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('video', { 
                title: "YIHUI VN | Video ",
                userInfo: user[0].info
             })
        } else {
            res.render('video', { 
                title: "YIHUI VN | Video ",
                userInfo: null
             })
        }
    })
    app.get('/video/gallery', async (req, res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('video-gallery', { 
                title: "YIHUI VN | Gallery ",
                userInfo: user[0].info
             })
        } else {
            res.render('video-gallery', { 
                title: "YIHUI VN | Gallery ",
                userInfo: null
             })
        }
    })

    //product routes
    app.get('/products', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products', { 
                title: "YIHUI VN | Sản Phẩm ",
                userInfo: user[0].info
             })
        } else {
            res.render('products', { 
                title: "YIHUI VN | Sản Phẩm ",
                userInfo: null
             })
        }
    })
    app.get('/products/servo-four', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-servo-four', { 
                title: "YIHUI VN | Four Column Deep Drawing Hydraulic Press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-servo-four', { 
                title: "YIHUI VN | Four Column Deep Drawing Hydraulic Press ",
                userInfo: null
             })
        }
    })
    app.get('/products/servo-sliding', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-servo-sliding', { 
                title: "YIHUI VN | Sliding Deep Drawing Hydraulic Press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-servo-sliding', { 
                title: "YIHUI VN | Sliding Deep Drawing Hydraulic Press ",
                userInfo: null
             })
        }
    })
    app.get('/products/cold-four', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-cold-four', { 
                title: "YIHUI VN | Four column cold forging hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-cold-four', { 
                title: "YIHUI VN | Four column cold forging hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/cold-sliding', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-cold-sliding', { 
                title: "YIHUI VN | Sliding cold forging hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-cold-sliding', { 
                title: "YIHUI VN | Sliding cold forging hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/hot-four', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-hot-four', { 
                title: "YIHUI VN | Four column hot forging hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-hot-four', { 
                title: "YIHUI VN | Four column hot forging hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/hot-sliding', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-hot-sliding', { 
                title: "YIHUI VN | Sliding hot forging hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-hot-sliding', { 
                title: "YIHUI VN | Sliding hot forging hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/single-four', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-single-four', { 
                title: "YIHUI VN | Four column single action hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-single-four', { 
                title: "YIHUI VN | Four column single action hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/single-sliding', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-single-sliding', { 
                title: "YIHUI VN | Sliding single action Hydraulic Press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-single-sliding', { 
                title: "YIHUI VN | Sliding single action Hydraulic Press ",
                userInfo: null
             })
        }
    })
    app.get('/products/powder', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-powder', { 
                title: "YIHUI VN | Powder compacting hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-powder', { 
                title: "YIHUI VN | Powder compacting hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/heat', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-heat', { 
                title: "YIHUI VN | Heat hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-heat', { 
                title: "YIHUI VN | Heat hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/fine', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-fine', { 
                title: "YIHUI VN | Fine Blanking hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-fine', { 
                title: "YIHUI VN | Fine Blanking hydraulic press ",
                userInfo: null
             })
        }
    })
    app.get('/products/cframe', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('products-cframe', { 
                title: "YIHUI VN | C frame hydraulic press ",
                userInfo: user[0].info
             })
        } else {
            res.render('products-cframe', { 
                title: "YIHUI VN | C frame hydraulic press ",
                userInfo: null
             })
        }
    })
    //term and policy
    app.get('/term', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('term', { 
                title: "YIHUI VN | Điều Khoản ",
                userInfo: user[0].info
             })
        } else {
            res.render('term', { 
                title: "YIHUI VN | Điều Khoản ",
                userInfo: null
             })
        }
    })
    app.get('/policy', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('policy', { 
                title: "YIHUI VN | Chính Sách Bảo Mật ",
                userInfo: user[0].info
             })
        } else {
            res.render('policy', { 
                title: "YIHUI VN | Chính Sách Bảo Mật ",
                userInfo: null
             })
        }
    })
    app.get('/contact', async (req,res)=>{
        if ( !!getId(req,'') ){
            const id = decId(getId(req,''))
            const user = await db.user({id: id}, "info")
            res.render('contact', { 
                title: "YIHUI VN | Liên Hệ ",
                userInfo: user[0].info
             })
        } else {
            res.render('contact', { 
                title: "YIHUI VN | Liên Hệ ",
                userInfo: null
             })
        }
    })

    app.get('/*', async (req,res)=>{
        res.redirect('/');
    })
}