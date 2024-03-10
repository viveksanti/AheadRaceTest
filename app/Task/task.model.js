module.exports = mongoose => {
    let ObjectId = mongoose.Schema.ObjectId;
    const Schema = mongoose.Schema;
        const Task = mongoose.model(
          "task",
          mongoose.Schema(
            {
                name: {
                  type: "string",
                  required: true,
                },
                description: {
                  type: "string",
                  required: true,
                },
                dueDate: {
                  type: "date",
                  required: true
                },
                status: { 
                  type: String, 
                  enum: ['todo', 'in-progress', 'completed'], 
                  default: 'todo' 
                },
                courses: [
                  { 
                    type: mongoose.Schema.Types.ObjectId,
                     ref: 'course' 
                    }
                  ],
                createdBy: {
                   type: mongoose.Schema.Types.ObjectId,
                    ref: 'user'
                   },
                isActive: {
                  type: 'boolean',
                  default: true
                }
              },
              {
                timestamps: true,
              }
          )
        );
      
        return Task;
      };