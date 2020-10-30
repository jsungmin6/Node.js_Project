const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// try {
//     fs.readdirSync('uploads');
// } catch (err) {
//     logger.error(`The folder cannot be found. create 'uploads' folder \n: ${JSON.stringify(err)}`);
//     fs.mkdirSync('uploads');
// }

// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, cb) {
//             cb(null, 'uploads/');
//         },
//         filename(req, file, cb) {
//             const ext = path.extname(file.originalname);
//             cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
//         },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 }
// });

exports.names = async function (req, res) {
    const name = req.query.name
    //TODO: 이름을 받으면 이름에 해당하는 편지내용을 2종류 타입으로 나눠서 최신순으로 리스트를 10개만 뿌려 줌.
    //또한 타입별 count를 해서 몇퍼센트 비율인지 보여줌
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(
                `
                SELECT id, email, nickname, createdAt, updatedAt 
                FROM UserInfo
                `
            );
            connection.release();
            return res.json(rows);
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.letters = async function (req, res) {
    const { name, letter } = req.body;
    //TODO: name 과 letter을 받아서 Letter table에 insert 한다.
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION

            const insertLetterQuery = `
                        INSERT INTO Letter(Name, letter)
                        VALUES (?, ?);
                            `;
            const insertLetterParams = [name, letter];
            await connection.query(insertLetterQuery, insertLetterParams);

            await connection.commit(); // COMMIT
            connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "작성완료",
            })
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.images = async function (req, res) {
    const { name, img } = req.body;
    //TODO: name과 이미지를 업로드. 이것도 letter table에 넣어야 함.

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(
                `
                SELECT id, email, nickname, createdAt, updatedAt 
                FROM UserInfo
                `
            );
            connection.release();
            return res.json(rows);
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};