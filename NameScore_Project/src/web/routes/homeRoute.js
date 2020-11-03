module.exports = function (app) {
    const home = require('../controllers/homeController');
    const upload = require('../../../config/multerMiddleware');

    app.get('/names/:name/goods', home.goodLetter);
    app.get('/names/:name/bads', home.badLetter);
    app.get('/names/:name/scores', home.nameScore);
    app.get('/uploads', home.uploads);
    app.route("/letters").post(home.letters);
    app.post("/images", upload.single('userfile'), home.images);
};
