import express from "express"
import multer from "multer";
import basicAuth from "express-basic-auth"
import os from 'os';
import QRCode from 'qrcode';


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


app.post("/upload", upload.array("files",10), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No file uploaded.");
    }

    req.files.forEach(file => {
      console.log("uploaded file",file.originalname);
    })

    console.log("Uploaded:", req.files.originalname);
    if(req.files.length === 1)
    res.send("File uploaded successfully :)");
    else res.send(`${req.files.length} files uploaded successfully :)`);
  });

//IP Address
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    for (const net of networkInterfaces[interfaceName]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return null;
}

app.get('/ip',(req,res)=>{
  const ipAddress = getLocalIp();
  if (!ipAddress) return res.status(500).json({ error: "IP not found" });

  console.log(`Your IP: ${ipAddress}`);
  res.json({ ipAddress }); 
});

app.get('/qr-code', async (req, res) => {
  const ip = getLocalIp();
  if (!ip) return res.status(500).json({ error: "IP not found" });

  const url = `http://${ip}:${PORT}`;

  try {
    const qr = await QRCode.toDataURL(url);
    res.json({ qr });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
  
});
  
app.listen(PORT,()=>{

    console.log("Server is running on port : ", PORT);

});