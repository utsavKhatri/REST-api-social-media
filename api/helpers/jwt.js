const jwt = require("jsonwebtoken");

// api/helpers/jwt.js


module.exports = {

  friendlyName: 'Create JWT',

  description: 'Create a JSON Web Token with the specified payload',

  inputs: {
    payload: {
      type: 'ref',
      required: true,
      description: 'The payload to include in the token'
    },
  },

  fn: async function(inputs, exits) {
    // Create the JWT token with the payload and secret key
    const token = await jwt.sign(inputs.payload, "utsav", { expiresIn: '24h' });

    // Return the token
    return exits.success(token);
  }
};






