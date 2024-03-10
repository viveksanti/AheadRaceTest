module.exports = app => {
    const Tasks = require("./../Task/task.controller");
    const middleware = require("./../middleware/auth");
    
    var router = require("express").Router();
    
    
    router.post("/addTask",middleware.hasLecturerRole, Tasks.addTask);
    router.get("/taskList",middleware.hasLecturerRole, Tasks.listTasks);
    router.get("/courses",middleware.hasLecturerRole, Tasks.courses);
    router.get("/getLearnerTasks",middleware.hasLearnerRole, Tasks.getLearnerTasks);
    router.put("/updateTaskStatus",middleware.hasLearnerRole, Tasks.updateTaskStatus);
    
    
    app.use('/api/tasks', router);
    }