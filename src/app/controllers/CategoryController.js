const {
  mongooseToObject,
  mutiMongoosesToObject,
} = require("../../ultils/mongoogses");
const Category = require("../Models/Category");
class CategoryController {
  getAll(req, res) {
    Category.find({})
      .then((categories) =>
        res.render("categories/danhsach", {
          categories: mutiMongoosesToObject(categories),
          user: req.user,
        })
      )
      .catch((erro) => console.log(erro));
  }
  async show(req, res) {
    console.log(req.user);
    res.render("categories/show", {
      user: req.user,
    });
  }
  async post(req, res) {
    const { name } = req.body;
    const cate = await Category.create({
      name: name,
    });
    res.status(200).json(cate);
  }
  async create(req, res) {
    const list_category = await Category.find({});
    res.render("sanphams/create", {
      user: req.user,
      list_category: mutiMongoosesToObject(list_category),
    });
  }
  store(req, res) {
    //tạo mới 1 đối tượng SanPham từ db
    const sanpham = new SanPham({
      name: req.body.name,
      img: req.file.filename,
      price: req.body.price,
      categoryId: req.body.idtheloai,
      decription: req.body.mota,
    });
    //Thêm dữ liệu vào db SanPham
    sanpham
      .save()
      .then(() => res.redirect("/sanphams/getAll"))
      .catch((err) => {});
  }
  //
  destroy(req, res, next) {
    let id = req.params.id;
    Category.findByIdAndRemove(id).then(() =>
      res.redirect("/categories/getAll")
    );
  }
  //GET /edit/id
  edit(req, res) {
    //Tìm kiếm sản phẩm theo id
    Category.findById(req.params.id).then((categories) =>
      res.render("categories/edit", {
        categories: mongooseToObject(categories),
        user: req.user,
      })
    );
  }
  update(req, res, next) {
    Category.updateOne({ _id: req.params.id }, req.body).then(() => {
      res.redirect("/categories/getAll");
    });
  }
}
module.exports = new CategoryController();
