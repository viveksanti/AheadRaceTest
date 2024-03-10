const db = require("../models");
const Users = db.users;
const Token = require("./../middleware/auth")
const Course = db.courses;
const userCourses = db.usercourses
const Role = db.roles

exports.signup = async (req, res) => {
    try {
        Users.findOne({email: req.body.email}).then(async(response) => {
            if(response) {
                res.status(400).json({
                    status: false,
                    message: "User with this email already exists"
                })
            }
            else {
                let findRole = await Role.findOne({role: req.headers.roleType})
                req.body.roleId = findRole._id
               let saveUser = await Users.create(req.body)
               res.status(200).json({
                status: true,
                message: "User signup successful"
            })
            }
        })
        .catch((err) => {
            console.log("err", err)
            res.status(400).json({
                status: false,
                message: err
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


exports.login = async (req, res) => {
   try {
  Users.findOne({email: req.body.email,password: req.body.password}).populate('roleId').then(async(response) => {
    if(response) {
       // console.log("role", response,response.roleId.name)
        let data = { userId: response._id, email: response.email, mobile: response.mobile, role: response.roleId.name }
        let token = await Token.generateToken(data)
        //console.log("Token",token)
        res.status(200).json({
            status: true,
            message: "Login successful",
            userToken: token
        })
    }
    else {
        res.status(400).json({
            status: false,
            message: "User not found"
        })
    }
  })
   }
   catch(err) {
    res.status(400).json({
        status: false,
        message: err
    })
   }
  }

  exports.user = async(req, res) =>{
    //console.log("user", req.decoded.userId)
    try {
       Users.findOne({_id: req.decoded.userId}).populate("roleId").select('name email').then((response) => {
        if(response) {
            res.status(200).json({
                status: true,
                message: "User",
                response: response
            })
        }
       })
    }
    catch(err) {
        console.log("err", err)
        res.status(400).json({
            status: false,
            message: err
        })
    }
  }


exports.addCoursesToUser = async (req, res) => {
    let courseIds = req.body.courseIds
    try {
         const user = await userCourses.findOne({learnerId: req.body.learnerId});
        if (!user) {
            let userCourseData = {
            learnerId : req.body.learnerId,
            courses: courseIds
        }
        let saveCourses = await userCourses.create(userCourseData)
        res.status(200).json({ message: "Courses added to user successfully" });
        }
        else {
            const courses = await Course.find({ _id: { $in: courseIds } });
            // //console.log("courses",courses)
                    const newCourses = courses.filter(course => !user.courses.includes(course._id));
            //console.log("newCourses",newCourses)
                    user.courses.push(...newCourses.map(course => course._id));
                    await user.save();
                    
                    res.status(200).json({ message: "Courses added to user successfully" });
        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


