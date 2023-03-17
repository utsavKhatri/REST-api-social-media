const jwt = require("jsonwebtoken");

/**
 * This is a middleware function.
 * @param {token} req
 * @return procced
 * @rejects {Error}
 */
module.exports = async (req, res, next) => {
  let message =
    "Access denied. You need to be loggedin to access this resource.";

  if (
    !req ||
    !req.headers ||
    (!req.headers.authorization && !req.headers.Authorization)
  ) {
    return {
      errors: [
        {
          code: "I_AUTHTOKEN_MISSING",
          message: message,
        },
      ],
    };
  }
  let token = req.headers["authorization"];
  // Check presence of Auth Token and decode
  if (!token) {
    // Otherwise, this request did not come from a logged-in user.
    return {
      errors: [
        {
          code: "I_AUTHTOKEN_MISSING",
          message: message,
        },
      ],
    };
  }
  token = token.split(" ")[1];
  try {
    result = await TokenService.decode({token: token});
  } catch (error) {
    sails.log.error('auth._authenticate: Error encountered: ', error);
      return {
        errors: [
          {
            code: 'E_DECODE',
            message: message
          }
        ]
      };
  }

  const now = Date.now() / 1000;
  if (result.exp <= now) {
    sails.log.info(`auth._authenticate: Access denied for: [${result.userName}] as the Auth Token has expired.`);
    return {
      errors: [
        {
          code: 'I_TOKEN_EXPIRED',
          message: message
        }
      ]
    };
  }
  context.user = result;
  return result;
};
