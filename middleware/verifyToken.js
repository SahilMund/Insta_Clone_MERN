
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model("UserData")

//creating a custom middleware for protected route 

module.exports = (req,res,next) =>{

    const token = req.header('auth-token');
    if(!token) return res.status(401).send({error:'Access Denied '});

    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        }) 
    })
}