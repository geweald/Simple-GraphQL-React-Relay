import { EventEmitter } from 'events';
import AppDispatcher from '../appDispatcher';
import { ActionTypes } from '../constants';


class PodcastsStore extends EventEmitter {
  _podcasts = [];

  constructor(props) {
    super(props);

    AppDispatcher.register(action => {
      switch (action.type) {
        case ActionTypes.RECEIVE_PODCASTS:
          this._podcasts = action.payload;
          this.emit('change');
          break;
        default:
          // nothing
      }
    });
  }

  getAll() {
    return this._podcasts;
  }
}

export default new PodcastsStore();