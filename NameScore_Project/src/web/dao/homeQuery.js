const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');



async function getScore(name) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const query = `
                select letterType, count(letterType) as count from Letter
                where name= ?
                group by letterType
                `;
            const params = [name];
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

async function insertLetterQuery(name, letter, letterType) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION

            const query = `
                        INSERT INTO Letter(name, letter, letterType)
                        VALUES (?, ?, ?);
                            `;
            const params = [name, letter, letterType];
            await connection.query(query, params);

            await connection.commit(); // COMMIT
            connection.release();
            return true

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

async function insertLetterImgQuery(name, letterImg, letterType) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION

            const query = `
                        INSERT INTO Letter(name, letterImg, letterType)
                        VALUES (?, ?, ?);
                            `;
            const params = [name, letterImg, letterType];
            await connection.query(query, params);

            await connection.commit(); // COMMIT
            connection.release();
            return true

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

async function getGoodLetter(name) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const query = `
            select letterIdx,letter,IFNULL(letterImg,'N') as letterImg,createdAt  from Letter where name = ? and letterType=1
                `;
            const params = [name];
            const [rows] = await connection.query(query, params);

            connection.release();
            return rows;
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

async function getBadLetter(name) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const query = `
            select letterIdx,letter,IFNULL(letterImg,'N') as letterImg,createdAt  from Letter where name = ? and letterType=2
                `;
            const params = [name];
            const [rows] = await connection.query(query, params);

            connection.release();
            return rows;
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
    insertLetterQuery,
    insertLetterImgQuery,
    getGoodLetter,
    getBadLetter,
    getScore
};