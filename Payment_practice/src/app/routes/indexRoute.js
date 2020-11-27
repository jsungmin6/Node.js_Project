module.exports = function (app) {
    const index = require('../controllers/indexController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.post('/createCard', index.createCard);
    app.post('/bikReq', index.bikReq);
    app.post('/payment', index.payment);
};
