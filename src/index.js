const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
const path = require("path");
const handlebars = require("express-handlebars");
const morgan = require("morgan");
const session = require("express-session");
const port = 8000;
const SortMiddle=require("./app/controllers/middlewire")
//Tạo session để làm giỏ hàng
app.use(
  session({
    secret: "1234567890abcdefghijklmnopqrstuvwxyz",
    resave: false,
    saveUninitialized: true,
  })
);
//Kết nối với SQL(Mongoose DB)
const db = require("./config/db");
app.use(SortMiddle)
//Tạo ra các đường dẫn trong website
const routes = require("./routes");

routes(app);
// //cài đặt đường dẫm đến các file ảnh trên website =>localhost:3000/grid.jpg
app.use(express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "public/img")));
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      gt: function (a, b) {
        return a > b;
      },
      lt: function (a, b) {
        return a < b;
      },
      eq: function (a, b) {
        return a === b;
      },
      
      subtract: (a, b) => a - b,
      lte: function(a,b){
        return a <=b
      },
      and: (a,b)=> a&&b,
      sortable:(filed,sort)=>{
        const icons={
          asc:'Giảm dần',
          desc:"Tăng dần",
          default:"Mặc định"
        }
        const types={
          default:"desc",
          desc:"asc",
          asc:"desc"
        }
        const icon=icons[sort.type]
        const type=types[sort.type]
     return `<a href="?_sort&colum=${filed}&type=${type}">
     <span ">${icon}</span>
   </a>`
      },
    },
  })
);
//connect mongoose
db.connect();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
app.use(morgan("combined"));

app.listen(port, () =>
  console.log(`Website đang lắng nghe đường dẫn là :${port}`)
);

//Để tạo 1 ứng dụng node js cài express-handlebars, morgan, nodemon, sass
//Để lấy ra dữ liệu trên thanh url với phương thức post =>res.body còn với get là
//=>res.query
//Để tạo ra 1 website đầu tiên vào file controllers tạo ra controller tương ứng sau
//đó vào file views tạo ra 1 views để hiển thị dữ liệu sau đó vào thư mục routers tạo
//ra các đường dẫ tương ứng
