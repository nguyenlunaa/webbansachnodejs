const SanPham = require("../Models/SanPham");
const jwt = require("jsonwebtoken");
const brycpt = require("bcrypt");
const {
  mutiMongoosesToObject,
  mongooseToObject,
} = require("../../ultils/mongoogses");
const User = require("../Models/User");
class HomeController {
  async show(req, res) {
    
    const currentPage = parseInt(req.query.page) || 1;

  // Số phần tử trên mỗi trang
    const itemsPerPage = 6
    const pages=[]
  // Tính vị trí bắt đầu và kết thúc của phần tử trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
  // const item=await SanPham.find()
  // Lấy danh sách phần tử cho trang hiện tại từ cơ sở dữ liệu
    let sanphams = await SanPham.find().skip(startIndex).limit(itemsPerPage)
    const totalItems = await SanPham.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 0 && i <= totalPages) {
        pages.push(i);
    }
    }

    res.render("Home/home", {
      sanphams: mutiMongoosesToObject(sanphams),
      currentPage, totalPages,
      user: req.user,
      pages
    });
    // const perPage = 2; // Số mục trên mỗi trang
    // const page = parseInt(req.query.page) || 1; // lấy page trên url nếu tồn tịa lấy ko thì mặc định là 1
    // const totalItems = await SanPham.countDocuments();
    // // console.log(totalItems); //tổng bản ghi trong mongoose
    // const sanphams = await SanPham.find()
    //   .skip((page - 1) * perPage) //lọc danh sách từ 0 -2
    //   .limit(perPage);
    // res.render("Home/Home", {
    //   sanphams: mutiMongoosesToObject(sanphams),
    //   page,
    //   user: req.user,
    //   pages: Math.ceil(totalItems / perPage), //làm tròn dưới
    // });
    // console.log(req.user.isAdmin);
    // SanPham.find({})
    //   .then((sanphams) => {
    //     res.render("Home/Home", {
    //       sanphams: mutiMongoosesToObject(sanphams),
    //       user: req.user,
    //       isAdmin: req.user.isAdmin,
    //     });
    //   })
    //   .catch((erro) => console.log(erro));
  }
  showLogin(req, res) {
    res.render("Home/Login");
  }
  showRegister(req, res) {
    res.render("Home/Register");
  }
  async store(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Không tồn tại username");
      }
      const validpassword = await brycpt.compare(
        req.body.password,
        user.password
      );
      if (!validpassword) {
        res.status(404).json("Mật khẩu không khớp");
      }
      if (user && validpassword) {
        //   // req.session.user = req.body.username;
        //   // const user1 = req.session.user;
        const accessToken = jwt.sign(
          {
            username: user.username,
            id: user.id,
            isAdmin: user.isAdmin,
          },
          "ac",
          { expiresIn: "30d" }
        );

        //   //Tạo refreshToken
        const refreshToken = jwt.sign(
          { username: user.username, id: user.id, isAdmin: user.isAdmin },
          "rf",
          { expiresIn: "365d" }
        );

        res.cookie("rf", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        const { password, ...orthers } = user._doc;
        //   //Hiển thị dữ liệu người dùng và tách user.password
        if (user.isAdmin === "true") {
          res.redirect("/sanphams/getAll");
          // res.status(200).json({accessToken,orthers});
        } else {
          res.redirect("/home");
          // res.status(200).json({accessToken,orthers});
          // SanPham.find({})
          // .then((users) => res.status(200).json(users))
          // .catch((erro) => console.log(erro));
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async register(req, res) {
    const { username, password, email, phonenumber, isAdmin } = req.body;
    //Tìm kiếm người dùng theo username:name trong csdl
    const existingUser = await User.findOne({ username });
    //Mã hóa mật khẩu
    const salt = brycpt.genSaltSync(10);
    const hashedPassword = brycpt.hashSync(password, salt);
    //Kiểm tra xem có tồn tại người dùng không
    //Nếu đã tồn tại
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    //Nếu chưa thì tạo tài khản mới
    const user = new User({
      username: username,
      phone: phonenumber,
      email: email,
      password: hashedPassword,
      isAdmin: isAdmin,
    });
    //Thêm vào csdl
    user.save();
    res.render("Home/Login");
  }
  userLogout(req, res) {
    res.clearCookie("rf");
    res.redirect("/home/login");
    // res.status(200).json("Logout thành công")
  }
  async search(req,res){
    let sanphams ;
    var title = req.query.search_input;
    let data = await SanPham.find({})
    if(title){
      sanphams=data.filter((item)=>{
            return item.name === title
         })
    }else if(title===""){
        sanphams=data
        res.redirect("/home")
    }
    res.render('Home/home', {
      sanphams: mutiMongoosesToObject(sanphams),
      user: req.user,
     });
  }
  showGioiThieu(req,res){
    res.render("Home/gioithieu", {
      user: req.user,
    });
  }
  
  showLienHe(req,res){
    res.render("Home/lienhe", {
      user: req.user,
    });
  }
  showThongKe(req,res){
    res.render("Home/thongke", {
      user: req.user,
    });
  }
}
module.exports = new HomeController();
