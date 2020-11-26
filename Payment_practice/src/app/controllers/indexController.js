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