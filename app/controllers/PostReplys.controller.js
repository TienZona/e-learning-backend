const PostReply = require("../Models/PostReply");

class PostReplyController {
  index(req, res, next) {}

  async findOfPost(req, res, next) {
    try {
      const respone = await PostReply.find({
        id_post: req.params.id,
      });

      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async create(req, res, next) {
    try {
      const reply = new PostReply(req.body);
      await reply
        .save()
        .then((respone) => res.send(respone))
        .catch((err) => res.send(err));
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }
}

module.exports = new PostReplyController();
