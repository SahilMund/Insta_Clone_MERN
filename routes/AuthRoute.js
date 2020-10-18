const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserData = mongoose.model("UserData");
const { JWT_SECRET } = require("../config/key");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// helps to send messgaes to mail
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}))

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "please fill all the fields" });
  }
  UserData.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      //bcrypt -- for hasing or protecting the password
      //by defalut salt value is 10  and more larger the salt more protective the password

      bcrypt
        .hash(password, 12)
        .then((hashedpassword) => {
          const userdata = new UserData({
            name,
            email,
            password: hashedpassword,
            pic,
          });

          userdata
            .save()
            .then((user) =>{
              // transporter.sendMail({
              //   to:user.email,
              //   from:"no-reply@insta.com",
              //   subject:"You signed up successfully",
              //   html:"<h1>Welcome to Our Instagram family </h1>"
              // })
              res.send({ message: "User Registerd Successfully" })
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "please filled all the fields" });
  }

  UserData.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        res.status(400).json({ error: "Email doesn't exists" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((domatch) => {
          if (domatch) {
            // res.json({message:"successfully Logged in"})
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following ,pic} = savedUser;
            res.header("auth-token", token).json({
              token,
              user: {
                _id,
                name,
                email,
                followers,
                following,
                pic
              },
            });
          } else {
            return res.status(422).send({ error: "password is wrong" });
          }
        })
    })
    .catch((err) => console.log(err));
});
module.exports = router;


// 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