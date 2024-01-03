const {
  mutiMongoosesToObject,
  mongooseToObject,
} = require("../../ultils/mongoogses");
const User = require("../Models/User");
class UserController {
  showUser(req, res) {
    User.find({})
      .then((users) =>
        res.render("users/showUser", {
          users: mutiMongoosesToObject(users),
          user: req.user,
        })
      )
      .catch((erro) => console.log(erro));
      //comment
      // User.find({})
      // .then((users) => res.status(200).json(users))
      // .catch((erro) => console.log(erro));
  }
  //Get /users/create
  create(req, res) {
    res.render("users/create");
  }
  //Post /users/create/store
  async store(req, res) {
    console.log(req.body);
    const adb = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    await adb
      .save()
      .then(() => res.redirect("/users"))
      .catch((err) => {
        console.log(err);
      });
  }
  destroy(req, res) {
    let id = req.params.id;
    User.findByIdAndRemove(id).then(() => res.redirect("/users"));
  }
  edit(req, res) {
    //Tìm kiếm sản phẩm theo id
    User.findById(req.params.id).then((sp) =>
      res.render("users/edit", {
        sp: mongooseToObject(sp),
      })
    );
  }
  update(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body).then(() => {
      res.redirect("/users");
    });
  }
}
module.exports = new UserController();
