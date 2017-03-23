import AppDispatcher from '../appDispatcher';
import { ActionTypes } from '../constants';

const ServerActions = {
  receivePodcasts(podcasts) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PODCASTS,
      payload: podcasts
    });
  }
};

export default ServerActions;