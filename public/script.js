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


uploadForm.addEventListener('submit',async(e)=>{

e.preventDefault();
const formData = new FormData(uploadForm);

try {
  const res = await fetch('/upload',{
    method : "POST",
    body:formData
  });

  const result = await res.text();
  message.textContent = result;
  message.style.color = res.ok? "green" : "red";

} catch (error) {
  message.textContent = "Error while sending file :(";
  message.style.color = "red";
}
});
