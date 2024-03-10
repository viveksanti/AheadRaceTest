module.exports = app => {
const Courses = require("./../Course/course.controller");
const middleware = require("./../middleware/auth");

var router = require("express").Router();


router.get("/allCourses", Courses.getAllCourses);

app.use('/api/courses', router);
}