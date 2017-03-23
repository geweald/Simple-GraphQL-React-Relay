const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');

const {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId,
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
} = require('graphql-relay');


const Schema = (db) => {
  class Store {}
  const store = new Store();

  const nodeDefs = nodeDefinitions(
    (globalId) => {
      const { type } = fromGlobalId(globalId);
      return type === 'Store' ? store : null;
    },
    (o) => { return o instanceof Store ? storeType : null; }
  );

  const podcastType = new GraphQLObjectType({
    name: 'Podcast',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: o => o._id
      },
      title: { type: GraphQLString },
      url: { type: GraphQLString },
      img_url: { type: GraphQLString },
      createdAt: {
        type: GraphQLString,
        resolve: o => new Date(o.createdAt).toISOString()
      }
    })
  });

  const podcastConnection = connectionDefinitions({
    name: 'Podcast',
    nodeType: podcastType
  });

  const storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      id: globalIdField('Store'),
      podcastConnection: {
        type: podcastConnection.connectionType,
        args: Object.assign({}, 
          connectionArgs,
          { query: { type: GraphQLString } }
        ),
        resolve: (_, args) => {
          const searchParams = {};
          if (args.query) {
            searchParams.title = new RegExp(args.query, 'i');
          }
          return connectionFromPromisedArray(
            db.collection('podcasts')
              .find(searchParams)
              .sort({ createdAt: -1 })
              .limit(args.first)
              .toArray(),
            args
          );
        }
      }
    }),
    interfaces: [nodeDefs.nodeInterface]
  });

  const addPodcastMutation = mutationWithClientMutationId({
    name: 'AddPodcast',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      url: { type: new GraphQLNonNull(GraphQLString) },
      img_url: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      podcastEdge: {
        type: podcastConnection.edgeType,
        resolve: o => ({ node: o.ops[0], cursor: o.insertedId })
      },
      store: {
        type: storeType,
        resolve: () => store
      }
    },
    mutateAndGetPayload: ({ title, url, img_url }) => {
      return db.collection('podcasts')
        .insertOne({ title, url, img_url, createdAt: Date.now() });
    }
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        node: nodeDefs.nodeField,
        store: {
          type: storeType,
          resolve: () => store
        }
      })
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => ({
        addPodcast: addPodcastMutation
      })
    })
  });

  return schema;
};

module.exports = Schema;