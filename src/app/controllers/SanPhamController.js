const SanPham = require("../Models/SanPham");
const {
  mongooseToObject,
  mutiMongoosesToObject,
} = require("../../ultils/mongoogses");
const Joi = require("joi")
const schema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  price: Joi.number().required(),
  idtheloai:Joi.string(),
  mota:Joi.string()
  // decription: Joi.string().required(),
});
const Category = require("../Models/Category");
class SanPhamController {
  async show(req, res) {
    if(res.locals._sort){
      // return res.json(res.locals._sort)
    }
    let totalPages
    const currentPage = parseInt(req.query.page) || 1;

  // Số phần tử trên mỗi trang
    const itemsPerPage = 6
    const pages=[]

  // Tính vị trí bắt đầu và kết thúc của phần tử trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
  // const item=await SanPham.find()
  // Lấy danh sách phần tử cho trang hiện tại từ cơ sở dữ liệu
    let currentItems = await SanPham.find()
   if(req.query.hasOwnProperty('_sort')){
    const invalidate=['asc','desc'].includes(req.query.type)
      currentItems = await SanPham.find().sort({
       [req.query.colum]:invalidate ? req.query.type :'desc'
     });
    }else{
     currentItems = await SanPham.find().skip(startIndex).limit(itemsPerPage)
     const totalItems = await SanPham.countDocuments();
     totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 0 && i <= totalPages) {
        pages.push(i);
    }
    }
    }
    // SanPham.find({})
    // .then((users) => res.status(200).json(users))
    // .catch((erro) => console.log(erro));
  // Tính tổng số trang
    res.render("sanphams/show", {
      currentItems: mutiMongoosesToObject(currentItems),
      currentPage, totalPages,
      user: req.user,
      pages
    });
  }
  async create(req, res) {
    const list_category = await Category.find({});
    res.render("sanphams/create", {
      user: req.user,
      list_category: mutiMongoosesToObject(list_category),
    });
  }
  store(req, res) {
    const { error, value } = schema.validate(req.body);
    console.log(value);
    //tạo mới 1 đối tượng SanPham từ db
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }else{
      const sanpham = new SanPham({
        name: req.body.name,
        img: `http://localhost:8000/${req.file.filename}`,
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
    
  }
  //
  destroy(req, res, next) {
    let id = req.params.id;
    SanPham.findByIdAndRemove(id).then(() => res.redirect("/sanphams/getAll"));
  }
  //GET /edit/id
  async edit(req, res) {
    const list_category = await Category.find({});
    SanPham.findById(req.params.id).then((sp) =>
      res.render("sanphams/edit", {
        sp: mongooseToObject(sp),
        user: req.body.username,
        list_category: mutiMongoosesToObject(list_category),
      })
    );
  }
  async find(req, res) {
    SanPham.findById(req.params.id).then((sp) =>
      res.render("Home/details", {
        sp: mongooseToObject(sp),
        user: req.user,
      })
    );
  }
  update(req, res, next) {
    SanPham.findOneAndUpdate(
      { _id: req.params._id },
      {
        name: req.body.name,
        decription: req.body.decription,
        img: req.file ? `http://localhost:8000/${req.file.filename}` : null,
        price: req.body.price,
        categoryId: req.body.categoryId,
      },
      { new: true } // Trả về bản ghi đã được cập nhật
    )
      .then((updatedSanPham) => {
        if (!updatedSanPham) {
          return res.status(404).send("Không tìm thấy bản ghi");
        }

        res.redirect("/sanphams/getAll");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = new SanPhamController();
