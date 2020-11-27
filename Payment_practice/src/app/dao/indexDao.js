const { pool } = require("../../../config/database");

// index
async function createCardDao(
  resultCode, resultMsg, bid, authDate, cardCode, cardName, tid, userIdx, cardNo, sign_data, enc_data, ediDate) {
  const connection = await pool.getConnection(async (conn) => conn);

  const createCardQuery = `
              INSERT INTO ghostpay_card_info (resultCode, resultMsg, bid, authDate, cardCode, cardName, tid, userIdx,cardNo,signData,encData,ediDate)
              VALUE (?,?,?,?,?,?,?,?,?,?,?,?)
              `;

  let createCardParams = [resultCode, resultMsg, bid, authDate, cardCode, cardName, tid, userIdx, cardNo, sign_data, enc_data, ediDate];
  const [createCardRows] = await connection.query(
    createCardQuery,
    createCardParams
  );
  connection.release();
  return createCardRows;
}

async function cardBidDao(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const query = `
              select bid from ghostpay_card_info where userIdx = ?
              `;
  let params = [userIdx];
  const [rows] = await connection.query(
    query,
    params
  );
  connection.release();
  return rows;
};

async function createHistoryDao(resultCode, resultMsg, tid, amt, authCode, authDate, acquCardCode, acquCardName,
  cardNo, cardCode, cardName, cardQuota, cardCl, cardInterest, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const query = `
              INSERT INTO ghostpay_history (resultCode,resultMsg,tid,amt,authCode,authDate,acquCardCode,acquCardName,
                cardNo,cardCode,cardName,cardQuota,cardCl,cardInterest,userIdx)
              VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
              `;
  let params = [resultCode, resultMsg, tid, amt, authCode, authDate, acquCardCode, acquCardName,
    cardNo, cardCode, cardName, cardQuota, cardCl, cardInterest, userIdx];
  const [rows] = await connection.query(
    query,
    params
  );
  connection.release();
  return rows;
};



module.exports = {
  createCardDao,
  cardBidDao,
  createHistoryDao
};