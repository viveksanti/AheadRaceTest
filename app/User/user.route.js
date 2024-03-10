module.exports = app => {
    const users = require("./../User/user.controller");
    const middleware = require("./../middleware/auth");
  
    var router = require("express").Router();

    router.post("/login", users.login);
    router.post("/signup", users.signup);
    router.get("/user",middleware.hasLearnerRole, users.user);
    router.post("/addCoursesToUser",middleware.hasLecturerRole, users.addCoursesToUser);

    app.use('/api/users', router);
}