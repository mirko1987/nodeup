const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// Set storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
//Init Upload

const upload = multer({
  storage: storage,
  limits: { filesize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myimage");
//Check file type

function checkFileType(file, cb) {
  //allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error:Image only");
  }
}
//init app

const app = express();
//ejs

app.set("view engine", "ejs");

//public
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No File Selected!"
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

// app.post("/upload",(req,res,(err)=>{
//     if(err){

//         escape.render("index",{
//             msg:err
//         })

//     }else{
//         console.log(req.file);
//         res.send("test");

//     }

// });

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
