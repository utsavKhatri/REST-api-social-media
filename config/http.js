/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */
// const express = require('express');
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


module.exports.http = {
  /****************************************************************************
   *                                                                           *
   * Sails/Express middleware to run for every HTTP request.                   *
   * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
   *                                                                           *
   * https://sailsjs.com/documentation/concepts/middleware                     *
   *                                                                           *
   ****************************************************************************/

  middleware: {
    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP requests.           *
     * (This Sails app's routes are handled by the "router" middleware below.)  *
     *                                                                          *
     ***************************************************************************/

    order: [
      "cookieParser",
      "session",
      "bodyParser",
      "fileMiddleware",
      "compress",
      "poweredBy",
      "cors",
      "router",
      "www",
      "favicon",
    ],

    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests.       *
     *                                                                          *
     * https://sailsjs.com/config/http#?customizing-the-body-parser             *
     *                                                                          *
     ***************************************************************************/

    bodyParser: (function () {
      const bodyParser = require("body-parser");
      const jsonParser = bodyParser.json();
      const urlencodedParser = bodyParser.urlencoded({ extended: true });
      return [jsonParser, urlencodedParser];
    })(),

    fileMiddleware: (function () {
      const multer = require("multer");
      const upload = multer();
      return upload.single("postpic");
    })(),
    cors: function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Headers", "*");
      // res.header('Access-Control-Allow-Credentials', true);
      next();
    },
  },
};
