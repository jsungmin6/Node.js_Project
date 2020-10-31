const multer = require('multer');
const path = require('path');
const fs = require('fs');
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");
AWS.config.loadFromPath(path.join(__dirname + "/awsconfig.json"));

let s3 = new AWS.S3();

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "manduawsbucket",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })
})


// try {
//     fs.readdirSync('uploads');
// } catch (error) {
//     console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
//     fs.mkdirSync('uploads');
// }

// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, cb) {
//             cb(null, 'uploads/');
//         },
//         filename(req, file, cb) {
//             const ext = path.extname(file.originalname);
//             cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//         },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 },
// });

module.exports = upload;