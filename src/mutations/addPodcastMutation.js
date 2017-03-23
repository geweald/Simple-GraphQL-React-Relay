import Relay from 'react-relay';

class AddPodcastMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation { addPodcast }
    `;
  }

  getVariables() {
    const { title, url, img_url } = this.props;

    return { title, url, img_url };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddPodcastPayload {
        podcastEdge,
        store { podcastConnection }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'podcastConnection',
      edgeName: 'podcastEdge',
      rangeBehaviors: {
        '': 'append'
      },
    }];
  }

  getOptimisticResponse() {
    return {
      podcastEdge: {
        node: this.getVariables()
      }
    };
  }
}

export default AddPodcastMutation;