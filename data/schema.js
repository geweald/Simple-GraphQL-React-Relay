const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLInt,
  GraphQLList,
  GraphQLString
} = require('graphql');


const Schema = (db) => {
  const podcastType = new GraphQLObjectType({
    name: 'Podcast',
    fields: () => ({
      _id: { type: GraphQLString },
      title: { type: GraphQLString },
      url: { type: GraphQLString },
      img_url: { type: GraphQLString },
    })
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        podcasts: {
          type: new GraphQLList(podcastType),
          resolve: () => db.collection('podcasts').find({}).toArray()
        }
      })
    }),

  });

  return schema;
};

module.exports = Schema;