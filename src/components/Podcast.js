import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';


class Podcast extends Component {
  _renderDateLabel = () => {
    const { podcast, relay } = this.props;

    if (relay.hasOptimisticUpdate(podcast)) {
      return 'Saving...';
    }
    return moment(podcast.createdAt).format('L');
  }

  render() {
    const { title, url, img_url } = this.props.podcast;

    return (
      <li>
        {this._renderDateLabel()} <a href={url}>{title}</a>
      </li>
    );
  }
}


const PodcastRelay = Relay.createContainer(Podcast, {
  fragments: {
    podcast: () => Relay.QL`
      fragment on Podcast {
        title,
        url,
        img_url,
        createdAt
      }
    `
  }
});

export default PodcastRelay;