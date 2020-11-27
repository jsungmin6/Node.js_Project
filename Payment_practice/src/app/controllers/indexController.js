const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const secret_config = require('../../../config/secret');
const iconv = require('iconv-lite')
const bodyParser = require("body-parser")
const CryptoJS = require("crypto-js")
const crypto = require("crypto")
const format = require('date-format');
const indexDao = require('../dao/indexDao');
const axios = require("axios");
const qs = require('qs');
const Iconv = require('iconv').Iconv;
const request = require('request')



const merchantKey = secret_config.merchantKey;
const merchantID = secret_config.merchantID;
const moid = 'nice_bill_test_3.0';

var amt = "100";
const goodsName = "bill";

exports.createCard = async function (req, res) {
    const userIdx = 1

    const { cardNo, expYear, expMonth, birth, cardPw } = req.body;
    const ediDate = format.asString('yyyyMMddhhmmss', new Date());
    let sign_data = `${merchantID}${ediDate}${moid}${merchantKey}`;
    sign_data = getSignData(sign_data).toString();
    let enc_data = `CardNo=${cardNo}&ExpYear=${expYear}&ExpMonth=${expMonth}&IDNo=${birth}&CardPw=${cardPw}`
    enc_data = encrypt(enc_data, merchantKey);
    const arr = {}

    arr['MID'] = merchantID;
    arr['EdiDate'] = ediDate;
    arr['EncData'] = enc_data;
    arr['SignData'] = sign_data;
    arr['CharSet'] = "utf-8";
    arr['EdiType'] = "JSON";
    arr['Moid'] = moid;

    let cardResponse;

    cardResponse = await axios.post('https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp', qs.stringify(arr));

    const resultCode = cardResponse.data.ResultCode
    const resultMsg = cardResponse.data.ResultMsg
    const bid = cardResponse.data.BID
    const authDate = cardResponse.data.AuthDate
    const cardCode = cardResponse.data.CardCode
    const cardName = cardResponse.data.CardName
    const tid = cardResponse.data.TID

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            //insert진행
            const createCardRows = await indexDao.createCardDao(
                resultCode, resultMsg, bid, authDate, cardCode, cardName, tid, userIdx, cardNo, sign_data, enc_data, ediDate);

            connection.release();

            return res.json({
                isSuccess: true,
                code: 200,
                message: "카드 등록 성공"
            });
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }

};


exports.payment = async function (req, res) {
    const userIdx = 1
    console.log(amt)

    //BID 구하기
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            //Bid 얻기
            var cardBid = await indexDao.cardBidDao(
                userIdx);

            connection.release();

        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }

    const bid = cardBid[0].bid
    const ranNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const ediDate = format.asString('yyyyMMddhhmmss', new Date());
    const transactionID = merchantID + "0116" + ediDate.substr(2, 12) + ranNum;
    let cardInterest = "0";
    let cardQuota = "00";

    let sign_data = `${merchantID}${ediDate}${moid}${amt}${bid}${merchantKey}`;
    sign_data = getSignData(sign_data).toString();

    const arr = {}
    arr['TID'] = transactionID;
    arr['BID'] = bid;
    arr['MID'] = merchantID;
    arr['EdiDate'] = ediDate;
    arr['Moid'] = moid;
    arr['Amt'] = amt;
    arr['GoodsName'] = goodsName;
    arr['SignData'] = sign_data;
    arr['CardInterest'] = cardInterest;
    arr['CardQuota'] = cardQuota;
    arr['CharSet'] = "utf-8";


    let approveResponse;

    approveResponse = await axios.post('https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp', qs.stringify(arr));

    const resultCode = approveResponse.data.ResultCode
    const resultMsg = approveResponse.data.ResultMsg
    const tid = approveResponse.data.TID
    amt = approveResponse.data.Amt
    const authCode = approveResponse.data.AuthCode
    const authDate = approveResponse.data.AuthDate
    const acquCardCode = approveResponse.data.AcquCardCode
    const acquCardName = approveResponse.data.AcquCardName
    let cardNo = approveResponse.data.CardNo
    const cardCode = approveResponse.data.CardCode
    const cardName = approveResponse.data.CardName
    cardQuota = approveResponse.data.CardQuota
    const cardCl = approveResponse.data.CardCl
    cardInterest = approveResponse.data.CardInterest

    console.log(approveResponse.data)

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            //Bid 얻기
            const createHistory = await indexDao.createHistoryDao(resultCode, resultMsg, tid, amt, authCode, authDate, acquCardCode, acquCardName,
                cardNo, cardCode, cardName, cardQuota, cardCl, cardInterest, userIdx);

            connection.release();

            return res.json({
                isSuccess: true,
                code: 200,
                message: "결제 성공"
            });

        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }


};




exports.bikReq = async function (req, res) {

    var aesString = "CardNo=" + card_num + "&ExpYear=" + YY + "&ExpMonth=" + MM + "&IDNo=" + birth + "&CardPw=" + cardpwd;

    var options = {
        url: "https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp",
        method: 'POST',
        header: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        encoding: null,
        form: {
            'MID': merchantID,
            'EdiDate': ediDate,
            'Moid': moid,
            'EncData': encrypt(enc_data, m_key),
            'SignData': crypto.createHash('sha256').update(sign_data).digest('hex'),
            'CharSet': 'utf-8',
        }
    }

    authRequest(options);
    res.send('Result data is in Terminal');
}




function stringToHex(str) {
    //converting string into buffer
    let bufStr = Buffer.from(str, 'utf8');

    //with buffer, you can convert it into hex with following code
    return bufStr.toString('hex');
}

const encrypt = (input, key) => {
    const algorithm = 'aes-128-ecb';
    // key = crypto.scryptSync(key, 'salt', 16);
    // // const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(algorithm, key.slice(0, 16), null);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(input, undefined, 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function getSignData(str) {
    var encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

function getAES(text, key) {
    var encKey = key.substr(0, 16);

    var cipher = crypto.createCipheriv('aes-128-ecb', encKey, Buffer.alloc(0));
    var ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');

    return ciphertext;
}


function authRequest(options) {
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var strContents = new Buffer(body);
            var returnObj = JSON.parse(iconv.decode(strContents, 'utf-8').toString())
            console.log(returnObj)
        }
    })
}