const fs = require('fs');
const express = require('express');
const GraphQLHTTP = require('express-graphql');
const { graphql } = require('graphql');
const { introspectionQuery } = require('graphql/utilities');
const { MongoClient } = require('mongodb');
const MONGO_URL = require('./mongo.config');
const Schema = require('./data/schema');

const app = express();

app.use(express.static('public'));

(async () => {
  const db = await MongoClient.connect(MONGO_URL);
  const schema = Schema(db);

  app.use('/graphql', GraphQLHTTP({ 
    schema,
    graphiql: true 
  }));

  app.listen(3000, () => console.log('Listening on port 3000...'));


  const json = await graphql(schema, introspectionQuery);
  
  fs.writeFile(
    './data/schema.json', 
    JSON.stringify(json, null, 2),
    err => {
      if (err) throw err;
      console.log('Schema JSON file created.');
    });

})();

