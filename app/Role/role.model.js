module.exports = mongoose => {
    const Role = mongoose.model(
      "role",
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
  
    return Role;
  };