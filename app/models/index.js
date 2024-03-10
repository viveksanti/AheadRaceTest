const dbConfig = require("./../../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./../User/user.model.js")(mongoose)
db.roles = require("./../Role/role.model.js")(mongoose)
db.courses = require("./../Course/course.model.js")(mongoose)
db.usercourses = require("./../User/userCourses.model.js")(mongoose)
db.tasks = require("./../Task/task.model.js")(mongoose)



module.exports = db;