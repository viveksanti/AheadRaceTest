const db = require("../models");
const Course = db.courses;


exports.getAllCourses = async (req, res) => {
    try {
        Course.find({}).then((response) => {
            res.status(200).json({
                status: true,
                message: response
            })
        })
    }
    catch(err) {
res.status(400).json({
        status: false,
        message: err
    })
    }
}