const express = require("express");
const fileUpload = require("express-fileupload");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000; // คุณสามารถเปลี่ยนเป็นพอร์ตที่ต้องการได้



// Middleware
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/uploads')));



app.get("/hi", (req,res) => {
    res.send("Hi WelCome Server 5")
})

// Api สำหรับอัปโหลดไฟล์
app.post("/api/upload/characters", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let imageFile = req.files.image;

  // สร้างชื่อไฟล์แบบสุ่ม
  const fileExtension = path.extname(imageFile.name);
  const fileName = crypto.randomBytes(16).toString("hex") + fileExtension;

  // สร้างโฟลเดอร์ uploads หากยังไม่มี
  const uploadPath = path.join(__dirname, "public/uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  // บันทึกไฟล์
  imageFile.mv(path.join(uploadPath, fileName), (err) => {
    if (err) {
      return res.status(500).send(err);
    }


    // ให้ตอบกลับเป็น json ทุกคนสามารถเปลี่ยนโดเมนของ server ตัวเองได้
    res.json({
        masage: "อัพโหลดสำเร็จ",
        url: `https://sv5.ani-night.online/uploads/${fileName}`
    })

  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
