/**
 * GraphQlController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { graphqlHTTP } = require("express-graphql");
const resolvers = require("../../graphql/resolvers");
const schema = require("../../graphql/schema");

module.exports = {
  graphql: graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
};
