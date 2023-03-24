const Posts = require("../Models/Post");

class PostsController {
  index(req, res) {}

  async findAll(req, res, next) {
    try {
      const respone = await Posts.find({ deleted: false });
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async findOfClass(req, res, next) {
    try {
      const respone = await Posts.find({
        deleted: false,
        id_class: req.params.id,
      });
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  //   async findByID(req, res, next) {
  //     try {
  //       const respone = await Posts.find({
  //         deleted: false,
  //         _id: req.params._id,
  //       });
  //       res.send(respone);
  //     } catch (err) {
  //       res.status(501);
  //       console.log(err);
  //     }
  //   }

  async create(req, res, next) {
    const post = new Posts(req.body);
    try {
      await post
        .save()
        .then((respone) => res.send(respone))
        .catch((err) => res.send(err));
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }

  async delete(req, res, next) {
    try {
      const respone = await Posts.updateOne(
        { _id: req.params.id },
        { deleted: true }
      );

      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }
}

module.exports = new PostsController();
