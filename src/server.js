const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
var fs = require("fs");
var mongoose = require("mongoose");
const app = express();
// app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Node started");
});

var corsObject = {
  origin: "http://localhost:4200",
  optionSuccessState: 200
};
app.use(cors(corsObject));
const filemodel = mongoose.model("filemodel", {
  image: { data: Buffer, contentType: String }
});
mongoose.connect("mongodb://localhost:27017/File", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  }
});
const filterFile = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(new Error("Upload jpeg,png"), false);
  }
};
var upload = multer({ storage: storage, fileFilter: filterFile });
app.post("/file", upload.single("image"), (req, res, next) => {
  const file = req.file;
  console.log(file);
  var newfilemodel = new filemodel();
  newfilemodel.image.data = fs.readFileSync(file.path);
  newfilemodel.contentType = "image/jpg" || "image/png";
 newfilemodel.save((err, res) => {
    console.log("<--", res, "--->");
    if (err) {
      console.log(err, "---------error---------");
    }
  });
 
  console.log(file.path, newfilemodel, "@@@@@@@", newfilemodel.image.data);
  if (!file) {
    const error = new Error("nope");
    return next(error);
  }
  res.send(file);
});
