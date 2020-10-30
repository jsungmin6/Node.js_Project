module.exports = function(app){
    const index = require('../controllers/homeController');
    app.get('/names/:name', home.names);
    app.route("/letters").post(home.letters);
    app.route("/images").post(home.images);
};