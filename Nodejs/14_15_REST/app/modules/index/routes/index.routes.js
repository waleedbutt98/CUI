const indexController = require('../controllers/index.controller');

module.exports = (app, version) => {

    app.get(version + '/', indexController.indexFunction);
    app.get(version + '/error', indexController.errorFunction);
};