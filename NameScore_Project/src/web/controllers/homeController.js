const { json } = require('express');
const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const homeQuery = require('../dao/homeQuery');


exports.goodLetter = async function (req, res) {

    const name = req.params.name

    const GoodLetters = await homeQuery.getGoodLetter(name);

    return res.json({
        isSuccess: true,
        code: 200,
        message: "칭찬 리스트 불러오기 완료",
        result: GoodLetters
    })

};



// exports.badLetter = async function (req, res) {
//     const name = req.query.name
//     //TODO: 이름을 받으면 이름에 해당하는 편지내용을 2종류 타입으로 나눠서 최신순으로 리스트를 10개만 뿌려 줌.
//     //또한 타입별 count를 해서 몇퍼센트 비율인지 보여줌
//     console.log(name)
// };


exports.letters = async function (req, res) {
    const { name, letter, letterType } = req.body;
    
    const insertLetter = await homeQuery.insertLetterQuery(name,letter,letterType);
            
    if(insertLetter){
        return res.json({
            isSuccess: true,
            code: 200,
            message: "작성완료",
        })
    } else{
        return false
    }
};



exports.images = async function (req, res) {
    const name = req.body.name;
    const letterType = Number(req.body.letterType);
    const letterImg = req.file.location;

    const insertLetterImg = await homeQuery.insertLetterImgQuery(name,letterImg,letterType);

    if(insertLetterImg){
        return res.json({
            isSuccess: true,
            code: 200,
            message: "이미지 업로드 완료",
        })
    } else{
        return false
    }

    res.render('main');
};

exports.uploads = async function (req, res) {
    try {
        res.render('main');
    } catch (err) {
        logger.error(`upload error\n: ${JSON.stringify(err)}`);
        return false;
    }
};