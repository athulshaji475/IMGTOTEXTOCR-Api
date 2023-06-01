const express=require('express')
const multer=require('multer')
const path=require('path')
const tesseract = require('node-tesseract-ocr');
const cors=require('cors')


//--------------------------------
const app=express()

app.set('view engine',"ejs")  //we seting ejs as view engin
app.use(express.static(path.join(__dirname+'/Uploads')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//------------------------
var storage=multer.diskStorage({
  destination:function(req,file,cd)
  {
    cd(null,
      "Uploads")
  },
  filename:function(req,file,cd)
  {
    cd(null,
      file.fieldname+'-'+Date.now()+path.extname(file.originalname)
      );
  },
})
//--------------------------------
const upload=multer({storage:storage})


app.get('/',(req,res)=>{
try {
 // res.sendFile(__dirname+'/index.html')   now we can use render method

 res.render('index')
} catch (error) {
  console.log(error)
}
})


//post---------------------
app.post('/ExctractTextFromimage',upload.single('file'),(req,res)=>{
console.log(req.file)
//teseract---- config--------------
const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

tesseract
  .recognize(req.file.path, config)
  .then((text) => {
    console.log("Result:", text)
    res.send(text)
  })
  .catch((error) => {
    console.log(error.message)
  })
})

const port=process.env.PORT||5001
app.listen(port,()=>{console.log(`server os running on ${port}`)})