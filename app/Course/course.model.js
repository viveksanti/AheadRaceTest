module.exports = mongoose => {
    const Course = mongoose.model(
      "course",
      mongoose.Schema(
        {
            name: {
              type: "string",
              required: true,
            },
            description: {
                type: "string"
              },
              isActive: {
              type: "boolean",
              default: true
            }
          },
          {
            timestamps: true,
          }
      )
    );
  
    return Course;
  };