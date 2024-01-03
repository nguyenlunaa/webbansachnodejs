const express=require("express");
const SanPham = require("../app/Models/SanPham");
const { mutiMongoosesToObject } = require("../ultils/mongoogses");
const router=express.Router()
router.get('',async function(req, res){
    let currentItems = await SanPham.find()
    var title = req.query.search_input;
    let data = await SanPham.find({})
    if(title){
        currentItems=data.filter((item)=>{
            return item.name === title
         })
    }else if(title===""){
        res.redirect("/sanphams/getAll")
    }
    res.render('sanphams/show', {
        currentItems: mutiMongoosesToObject(currentItems),
        user: req.user,
     });
})
module.exports=router


