import React, { Component } from 'react';
import API from '../api';
import PodcastsStore from '../stores/podcastsStore';


class Main extends Component {
  state = { podcasts: PodcastsStore.getAll() }

  componentDidMount() {
    API.fetchPodcasts();
    PodcastsStore.on('change', this._onChange);
  }

  componentWillUnmount() {
    PodcastsStore.removeListener('change', this._onChange);
  }

  _getAppState = () => {
    return { podcasts: PodcastsStore.getAll() };
  }

  _onChange = () => {
    this.setState(this._getAppState);
  }

  render() {
    const content = this.state.podcasts.map(p => {
      return (
        <li key={p._id}>
          <a href={p.url}>{p.title}</a>
        </li>
      );
    });

    return (
      <div>
        <h3>Podcasts:</h3>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
}

export default Main;