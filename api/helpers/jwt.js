const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: 'Create token',

  description: 'Generate a JWT token for the specified user.',

  inputs: {
    id: {
      type: 'ref',
      description: 'The user object to create a token for.',
      required: true,
    },
  },

  fn: async function(inputs, exits) {
    const user = inputs.id;
    const token = jwt.sign({id: user}, process.env.SECRET, {
      expiresIn: "2h",
    });
    return exits.success(token);
  },
};







