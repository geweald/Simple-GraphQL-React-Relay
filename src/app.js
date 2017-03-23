import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import Main from './components/Main';


class HomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    store: (Component) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  };
}

const RelayContainer = (
  <Relay.RootContainer
    Component={Main}
    route={new HomeRoute()}
  />
);

ReactDOM.render(RelayContainer, document.querySelector('#react'));