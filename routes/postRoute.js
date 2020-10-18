const router = require("express").Router();
const mongoose = require("mongoose");
const PostData = mongoose.model("PostData");
const verify = require("../middleware/verifyToken");

// creating new post
router.post("/createPost", verify, (req, res) => {
  const { title, body, pic } = req.body;

  if (!title || !body || !pic) {
    return res.status(422).send({ error: "Please fill all the fields" });
  }
  const post = new PostData({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.send({ result });
    })
    .catch((err) => console.log(err));
});

//fetching all the records
router.get("/getallPost", verify, (req, res) => {
  PostData.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((result) => res.send({ data: result }))
    .catch((err) => console.log(err));
});

//for getting datas from specific user
router.get("/myPost", verify, (req, res) => {
  PostData.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypostdata) => res.send({ data: mypostdata }))
    .catch((err) => console.log(err));
});

// for like
router.put("/like", verify, (req, res) => {
  PostData.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  ).populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// for dislike
router.put("/dislike", verify, (req, res) => {
  PostData.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  ).populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
// for love
router.put("/love", verify, (req, res) => {
  PostData.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { loves: req.user._id },
    },
    { new: true }
  ).populate("comments.postedBy","_id name")  
  .populate("postedBy","_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// for dislike
router.put("/hate", verify, (req, res) => {
  PostData.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { loves: req.user._id },
    },
    { new: true }
  ).populate("comments.postedBy","_id name")  
  .populate("postedBy","_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// for comments
router.put("/comment", verify, (req, res) => {
  const comment ={
    text:req.body.text,
    postedBy:req.user._id
  }
  PostData.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  ).populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")

  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});


//  delete post 
router.delete('/deletepost/:postId',verify, (req, res) => {
  PostData.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err});
    }
    // checking that the id of the logged in user is eauqls to the posts user id
  
    else if(post.postedBy._id.toString() === req.user._id.toString() ){
        post.remove()
        .then(result =>{
          res.json({response:result,message:"Post Deleted Successfully"})
        }).catch(err => console.log(err))
    }
  })
});

// deleting comment
router.delete('/deletecmnt/:postId',verify, (req, res) => {
  PostData.findOne({_id:req.params.postId})
  .populate("postedBy","_id name")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err});
    }
    else if(post.postedBy._id.toString() === req.user._id.toString() ){
        post.remove()
        .then(result =>{
          res.json({response:result,message:"Comment Deleted Successfully"})
        }).catch(err => console.log(err))
    }
  })
});

// to see only my followers all posts
router.get("/getsubposts", verify, (req, res) => {
  // if postedBy in following :then display the posts
  PostData.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts) => res.json({data:posts }))
    .catch((err) => console.log(err));
});
module.exports = router;
