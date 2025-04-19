import express from "express"
import multer from "multer";
import basicAuth from "express-basic-auth"

const app = express();

const PORT = 3000;

app.use(basicAuth({
    users: { 'Praveen': '1234',
        'Rohit' : 'rohit2006'
     },
 
    challenge: true,
    unauthorizedResponse: 'Not authorized'
}));


app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });


const upload = multer({ storage: storage });


app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log("Uploaded:", req.file.originalname);
    res.send("File uploaded successfully :)");
  });
  
app.listen(PORT,()=>{

    console.log("Server is running on port : ", PORT);

});