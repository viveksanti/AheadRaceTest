module.exports = mongoose => {
let ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema;
    const User = mongoose.model(
      "user",
      mongoose.Schema(
        {
            name: {
              type: "string",
              required: true,
            },
            password: {
              type: "string",
              required: true,
            },
            email: {
              type: "string",
              required: true,
              unique: true,
            },
            mobile: {
              type: "string",
            },
            isActive: {
              type: "boolean",
              default: true
            },
            roleId: {
                type: ObjectId,
                ref: "role",
              },
              courses: [{ type: Schema.Types.ObjectId, ref: "course" }]
          },
          {
            timestamps: true,
          }
      )
    );
  
    return User;
  };