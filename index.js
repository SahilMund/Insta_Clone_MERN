const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { mongoURI } = require("./config/key");

//connecting with mongodb
mongoose
    .connect(mongoURI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify:false,
    })
    .then(() => console.log("Mondodb Connected...."))
    .catch(err => console.error(err));
    

// requiring mongodb  schema
require('./models/userModel')
require('./models/postModel')

app.use(express.json())

//requiring router middlewares
app.use('/',require('./routes/AuthRoute'))
app.use('/',require('./routes/postRoute'))
app.use('/',require('./routes/userRoute'))


//listening to the port
const port = process.env.PORT || 5000;


if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirrname,"client","build","index.html"))
    })
}


app.listen(port, () => console.log(`Server running on port ${port}....`));
