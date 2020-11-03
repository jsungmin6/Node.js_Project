module.exports = function (app) {
    const comment = require('../controllers/commentController');
    app.get('/letters/:letterIdx/comments', comment.comments);
    app.post('/comments', comment.createComments);
};
