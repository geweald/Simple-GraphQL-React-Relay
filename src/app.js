import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import Hello from './components/Main';

ReactDOM.render(<Hello />, document.querySelector('#react'));

console.log(
  Relay.QL`query {
    podcasts {
      title,
      url
    }
  }`, 'ok'
);