
const multer  = require('multer')
const upload = multer({dest: 'uploads/'});

const FileUploader=multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            console.log("amol",file)
            callback(null,"uploads")
        },
        filename:function(req,file,callback){
            callback(null,file.originalname)
        }
    })
}).single("avatar")



// const multer=require("multer")
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,"./uploads")
//     },
//     filename: function (req, file, cb) {
//         console.log("Filename",req.file,file)
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.originalname)
      
//     }
//   })
  
//   const FileUploader = multer({ storage: storage })



module.exports={
    FileUploader
}