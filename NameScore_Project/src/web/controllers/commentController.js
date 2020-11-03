const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const commentQuery = require('../dao/commentQuery');


exports.comments = async function (req, res) {
    const letterIdx = req.params.letterIdx

    const commentList = await commentQuery.getComments(letterIdx);

    if (commentList.length == 0) return res.json({ isSuccess: false, code: 301, message: "댓글이 존재하지 않습니다." });

    return res.json({
        isSuccess: true,
        code: 200,
        message: "댓글 불러오기 성공",
        result: commentList
    })

};


exports.createComments = async function (req, res) {
    const { letterIdx, commentId, comment } = req.body

    const commentList = await commentQuery.postComments(letterIdx, commentId, comment);

    if (commentList) {
        return res.json({
            isSuccess: true,
            code: 200,
            message: "댓글 생성 성공",
        })
    } else {
        return res.json({
            isSuccess: false,
            code: 100,
            message: "댓글 생성 실패",
        })
    }


};