module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
  
    var router = require("express").Router();

    router.post("/create", tutorials.create);

    app.use('/api/tutorials', router);
}