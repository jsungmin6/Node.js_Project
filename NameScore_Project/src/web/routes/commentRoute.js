module.exports = function (app) {
    const home = require('../controllers/commentController');
    app.get('/names/:name', home.names);
    app.route("/letters").post(home.letters);
    app.route("/images").post(home.images);
};
