const db = require("../models");
const Task = db.tasks
const Courses = db.courses
const Users = db.users
const userCourses = db.usercourses


exports.listTasks = async (req, res) => {
    try {
        
        let tasks = await Task.find({createdBy: req.decoded.userId}).select({ _id: 0,name: 1, dueDate: 1, createdAt: 1,status: 1 }).populate("courses","name").sort({dueDate: -1 })
        
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.courses = async (req, res) => {
    const nameFilter = req.query.name;

    try {
        const query = [
            {
                $match: {
                    name: {
                        $regex: nameFilter || '', 
                        $options: 'i'
                    }
                }
            },
            {
                $lookup: {
                    from: 'usercourses',
                    localField: '_id',
                    foreignField: 'courses',
                    as: 'userCourses'
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'courses',
                    as: 'tasks'
                }
            },
            {
                $project: {
                    name: 1,
                    userCount: { $size: '$userCourses' },
                    taskCount: { $size: '$tasks' }
                }
            }
        ];

        const courses = await Courses.aggregate(query)//.toArray();
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching courses');
    }
}

exports.addTask =  async (req, res) => {
    try {
        const { name, description, dueDate, courses } = req.body;
        let createdBy = req.decoded.userId

        const learners = await userCourses.find({ courses: { $in: courses } }).populate('learnerId');
        const task = new Task({
            name,
            description,
            dueDate,
            courses,
            createdBy
        });
//console.log("task", task)
        learners.forEach(async userCourse => {
            const learner = userCourse;
            console.log("task",task)
            learner.tasks.push(task);
            await learner.save();
        });

        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getLearnerTasks = async (req, res) => {
    // let tasks = await userCourses.aggregate([
    //     {
    //       $match: {
    //         "learnerId": req.decoded.userId // Match document by _id
    //       }
    //     },
    //     {
    //       $unwind: "$tasks" // Deconstruct the tasks array
    //     },
    //     {
    //       $project: {
    //         "_id": 0,
    //         "name": "$tasks.name",
    //         "status": "$tasks.status",
    //         "dueDate": "$tasks.dueDate"
    //       }
    //     }
    //   ])
     await userCourses.find({learnerId: req.decoded.userId}, { "tasks.name": 1, "tasks.status": 1, "tasks.dueDate": 1 })
    .then(tasks => {
        res.status(200).json({
            status: true,
            message: "User Tasks",
            data: tasks[0].tasks
          })
    })
    .catch(error => {
        res.status(400).json({
            status: false,
            message:error
          })
    });
      
}

exports.updateTaskStatus = async (req, res) => {
    try {
        const response = await userCourses.findOne({learnerId: req.decoded.userId});
        //console.log("res", response);
        
        const unfinishedTasks = response.tasks.filter(task => task.status !== "completed" && !task._id.equals(req.body.taskId));
        
        if (unfinishedTasks.length === 0) {
            const taskIndex = response.tasks.findIndex(task => task._id.equals(req.body.taskId));
            // console.log("taskIndex", taskIndex);
            
            if (taskIndex !== -1) {
                response.tasks[taskIndex].status = req.body.status;

                await response.save();
                res.status(200).json({
                    status: true,
                    message: "Task updated successfully"
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: "Task not found"
                });
            }
        } else {
            res.status(400).json({
                status: false,
                message: "Previous Tasks aren't finished."
            });
        }
    } catch (err) {
        console.log("err", err);
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
};





