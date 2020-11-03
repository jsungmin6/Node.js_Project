const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');


async function getComments(letterIdx) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const query = `
                select commentId, comment, createdAt from Comment
                where letterIdx = ? and isDeleted = 'N'
                order by createdAt
                `;
            const params = [letterIdx];
            const [rows] = await connection.query(query, params);

            connection.release();
            return rows
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

async function postComments(letterIdx, commentId, comment) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const query = `
                        INSERT INTO Comment(letterIdx, commentId, comment) VALUES(?,?,?)
                `;
            const params = [letterIdx, commentId, comment];
            const [rows] = await connection.query(query, params);

            connection.release();
            return rows
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


module.exports = {
    getComments,
    postComments
};