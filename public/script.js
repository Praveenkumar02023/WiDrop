window.addEventListener('DOMContentLoaded',async()=>{
  const IP = document.getElementById("IP");
  const qrImage = document.getElementById("qrImage");
  const qrText = document.getElementById("qrText");

  try {
    const res = await fetch('/ip');
    if(res.ok){
      const result = await res.json();
      IP.textContent = `Receiver's IP: ${result.ipAddress}`;
    }else{
      IP.textContent = "Not Found";
    }
  } catch (error) {
    console.log('Error fetching IP :',error);
  }

  try {
    const qrRes = await fetch('/qr-code');
    const qrData = await qrRes.json();

    if (qrData.qr) {
      qrImage.src = qrData.qr;
      qrImage.style.display = "block";
      qrText.textContent = `Scan to open`;
    } else {
      qrText.textContent = "QR code not available.";
    }
  } catch (err) {
    console.error("Error fetching QR code:", err);
    qrText.textContent = "Error loading QR code.";
  }
});

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const selectButton = document.getElementById("selectBtn");
const dropZone = document.getElementById("dropZone");
const message = document.getElementById("message");
const submit = document.getElementById("submit");

let selectedFile = null;

fileInput.addEventListener("change", () => {

 selectedFile = fileInput.files[0];
 fileName.textContent = selectedFile ? selectedFile.name : "No file chosen";
 message.textContent = "";
});

selectButton.addEventListener('click',()=>{
  fileInput.click();
});


dropZone.addEventListener('dragover',(e)=>{
  e.preventDefault();
  dropZone.classList.add('highlight');
})

dropZone.addEventListener('dragleave',()=>{
  dropZone.classList.remove('highlight');
})

dropZone.addEventListener('drop',(e)=>{
  e.preventDefault();
  dropZone.classList.remove('highlight');

  const files = e.dataTransfer.files;
  
  if(files.length > 0){
    selectedFile = files[0];
    fileName.textContent = selectedFile ? selectedFile.name : "No file chosen";
    fileInput.files = files;
  }
})
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const files = fileInput.files;

  if (!files || files.length === 0) {
    message.textContent = "No files selected.";
    message.style.color = "red";
    // console.log("No files selected!"); 
    return;
  }

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]); 
  }

  // console.log("Submitting form with files:", files);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const resultText = await res.text();

    if (!res.ok) {
      console.error("Server responded with an error:", resultText);
      throw new Error(resultText);
    }

    message.textContent = resultText;
    message.style.color = "green";
  } catch (error) {
    console.error("Upload failed:", error);
    message.textContent = `Upload failed: ${error.message}`;
    message.style.color = "red";
  }
});