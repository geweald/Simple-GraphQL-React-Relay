import React, { Component } from 'react';
import Relay from 'react-relay';
import { debounce } from 'lodash';

import Podcast from './Podcast';
import AddPodcastMutation from '../mutations/addPodcastMutation';


class Main extends Component {
  _search = debounce((query) => {
    this.props.relay.setVariables({ query });
  }, 300)

  _onSearch = (e) => {
    this._search(e.target.value);
  }

  _onSubmit = (e) => {
    e.preventDefault();

    const { newTitle, newImgUrl, newUrl } = this.refs;

    Relay.Store.commitUpdate(
      new AddPodcastMutation({
        title: newTitle.value,
        url: newUrl.value,
        img_url: newImgUrl.value,
        store: this.props.store
      })
    );

    newTitle.value = '';
    newUrl.value = '';
    newImgUrl.value = '';
  }

  _setLimit = (e) => {
    const limit = Number(e.target.value);
    this.props.relay.setVariables({ limit });
  }

  render() {
    const content = this.props.store.podcastConnection.edges
      .map(edge => <Podcast key={edge.node.id} podcast={edge.node} />);

    return (
      <div>
        <h3>Podcasts:</h3>
        <form onSubmit={this._onSubmit}>
          <input type='text' placeholder='Title' ref='newTitle' />
          <input type='text' placeholder='Url' ref='newUrl' />
          <input type='text' placeholder='Img url' ref='newImgUrl' />

          <button type='submit'>Add</button>
        </form>
        <p> Search: 
          <input type='text' placeholder='Search' onChange={this._onSearch} />
        </p>
        <p>Limit: 
          <select 
            onChange={this._setLimit} 
            defaultValue={this.props.relay.variables.limit}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
          </select>
        </p>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
}

const MainRelay = Relay.createContainer(Main, {
  initialVariables: {
    limit: 5,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        podcastConnection(first: $limit, query: $query) {
          edges {
            node {
              id,
              ${Podcast.getFragment('podcast')}
            }
          }
        }
      }
    `
  }
});

export default MainRelay;