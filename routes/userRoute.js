const router = require("express").Router();
const mongoose = require("mongoose");
const verify = require("../middleware/verifyToken");
const PostData = mongoose.model("PostData");
const UserData = mongoose.model("UserData");

//profile of user
router.get("/user/:id", verify, (req, res) => {
  UserData.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      PostData.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

// follow
router.put("/follow", verify, (req, res) => {
  UserData.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      UserData.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// unfollow
router.put("/unfollow", verify, (req, res) => {
  UserData.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      UserData.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updateProfilepic", verify,(req, res) => {
  UserData.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    {new:true},
    (err, result) => {
      if(err) {
        return res.status(422).json({error:"Unable to update the pic"});
      }
      res.json(result)
    }
  );
});


router.post('/search-users',(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  UserData.find({email:{$regex:userPattern}})
  .select("_id email")
  .then(user=>{
      res.json({user})
  }).catch(err=>{
      console.log(err)
  })

})



module.exports = router;
