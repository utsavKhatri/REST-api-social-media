const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Admin token",

  description: "",

  inputs: {
    id: {
      type: "ref",
      description: "The user object to create a token for.",
      required: true,
    },
    admin: {
      type: "ref",
      description: "The admin object to create a token for.",
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    const user = inputs.id;
    const admin = inputs.admin;
    const token = jwt.sign({ id: user, admin: admin }, process.env.SECRET, {
      expiresIn: "2h",
    });
    return exits.success(token);
  },
};
