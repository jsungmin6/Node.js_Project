const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const secret_config = require('../../../config/secret');
const iconv = require('iconv-lite')
const request = require('request')
const bodyParser = require("body-parser")
const CryptoJS = require("crypto-js")
const format = require('date-format');
const indexDao = require('../dao/indexDao');

var ediDate = format.asString('yyyyMMddhhmmss', new Date());
var mid = secret_config.mid
var amt = '1';
var moid = 'nice_api_test_3.0';
var BuyerName = '구매자';
var BuyerEmail = 'happy@day.com';
var BuyerTel = '00000000000';
var enc_data = "";
var sign_data = "";
// 1. 카드등록
// 배열에 MID,EdiDate,Moid,EncData,SignData,BuyerName,BuyerEmail,BuyerTel,CharSet,EdiType 을 넣어야 함.
// EncData 에는 CardNo, ExpYear, ExpMonth, IDNo, CardPw 가 들어가야 함
// SignData 에는 MID, EdiDate, Moid, 상점키 들어가야 함
// 암호화 hex, SHA256, aes-128-ecb 통해서 EncData 와 SignData 만들어야 함.
// POST 메서드 사용
// 헤더에 Content-Type:application/x-www-form-urlencoded 사용
// Encoding : EUC-KR 
// https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp 로 보내야 함.

exports.test = async function (req, res) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await indexDao.defaultDao();
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

function getSignData(str) {
    var encrypted = CryptoJS.SHA256(str);
    return encrypted;
}