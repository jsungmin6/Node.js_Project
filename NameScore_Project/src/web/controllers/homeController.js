const { json } = require('express');
const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const homeQuery = require('../dao/homeQuery');

exports.nameScore = async function (req, res) {

    const name = req.params.name

    const scores = await homeQuery.getScore(name);

    goodCount = scores[0].count;
    badCount = scores[1].count;

    //평이 없으면 50점, 좋은 평가만 있으면 100점, 나쁜평가만 있으면 0점.
    if (goodCount === 0 && badCount === 0) {
        score = 50
    } else if (goodCount === 0) {
        score = 0
    } else if (badCount === 0) {
        score = 100
    } else {
        score = (goodCount * 100 / (goodCount + badCount)).toFixed(1)
    };

    return res.json({
        isSuccess: true,
        code: 200,
        message: "이름 점수 조회 성공",
        result: score
    })

};

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

exports.badLetter = async function (req, res) {

    const name = req.params.name

    const badLetters = await homeQuery.getBadLetter(name);

    return res.json({
        isSuccess: true,
        code: 200,
        message: "비판 리스트 불러오기 완료",
        result: badLetters
    })

};

exports.badLetter = async function (req, res) {

    const name = req.params.name

    const badLetters = await homeQuery.getBadLetter(name);

    return res.json({
        isSuccess: true,
        code: 200,
        message: "비판 리스트 불러오기 완료",
        result: badLetters
    })

};



exports.letters = async function (req, res) {
    const { name, letter, letterType } = req.body;

    const insertLetter = await homeQuery.insertLetterQuery(name, letter, letterType);

    if (insertLetter) {
        return res.json({
            isSuccess: true,
            code: 200,
            message: "작성완료",
        })
    } else {
        return false
    }
};



exports.images = async function (req, res) {
    const name = req.body.name;
    const letterType = Number(req.body.letterType);
    const letterImg = req.file.location;

    const insertLetterImg = await homeQuery.insertLetterImgQuery(name, letterImg, letterType);

    if (insertLetterImg) {
        return res.json({
            isSuccess: true,
            code: 200,
            message: "이미지 업로드 완료",
        })
    } else {
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