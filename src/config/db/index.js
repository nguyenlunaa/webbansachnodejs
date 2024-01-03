const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(process.env.Mongoose_connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối thành công với Mongoose");
  } catch (error) {
    console.log("Kết nối thất bai");
  }
}
module.exports = { connect };