const Posts = require("../Models/Post");
const Course = require("../Models/Course")

class PostsController {
  index(req, res) {}

  async findAll(req, res, next) {
    try {
      const respone = await Posts.find({ deleted: false }).sort({ created_at: -1 });
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
      }).sort({ created_at: -1 });
      res.send(respone);
    } catch (err) {
      res.status(501);
      console.log(err);
    }
  }


  async create(req, res, next) {
    const post = new Posts(req.body);
    const id_class = post.id_class;
    const course  = await Course.findOne({ id: id_class }, [
      "member",
    ]);
    const emails = course.member.map((item) => {
      return item.email;
    })

    try {
      await post
        .save()
        .then((respone) => {
          res.send(respone);
        })
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
