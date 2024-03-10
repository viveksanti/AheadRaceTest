module.exports = mongoose => {
    let ObjectId = mongoose.Schema.ObjectId;
    const Schema = mongoose.Schema;
        const UserCourses = mongoose.model(
          "userCourses",
          mongoose.Schema(
            {
                courses: [
                    { 
                      type: mongoose.Schema.Types.ObjectId, 
                      ref: 'course' 
                    }
                ],
                learnerId: {
                    type: ObjectId, 
                    ref: 'user' 
                },
                // assignedBy: {
                //     type: ObjectId, 
                //     ref: 'user'
                // },
                isActive: {
                    type: 'boolean',
                    default: true
                },
                tasks: [
                  //{
                //   task: {
                //     type: mongoose.Schema.Types.ObjectId,
                //     ref: 'task'
                //   }, 
                //   status: {
                //     type: String,
                //     default: 'todo' 
                //   }
                      
                // }

               { type: 'Object'}
              ]
              },
              {
                timestamps: true,
              }
          )
        );
      
        return UserCourses;
      };