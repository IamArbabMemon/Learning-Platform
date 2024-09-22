import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/videos')
    },

    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});
  
const upload = multer({ storage: storage });

export {
  upload
}



