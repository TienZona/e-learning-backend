const express = require("express");
const Post = require("../controllers/PostsController");
const PostReply = require("../controllers/PostReplys.controller")

const router = express.Router();

router.route("/post")
    .get(Post.findAll)
    .post(Post.create)

router.route("/post/:id")
    .get(Post.findOfClass)
    .delete(Post.delete)

router.route("/post/reply/:id")
    .get(PostReply.findOfPost)
    .post(PostReply.create)




module.exports = router;
