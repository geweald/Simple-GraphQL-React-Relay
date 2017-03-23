import ServerActions from './actions/serverActions';

export default {
  fetchPodcasts() {
    fetch('/graphql', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          podcasts {
            _id,
            title,
            url,
            img_url
          }
        }`
      })
    })
    .then(res => res.json())
    .then(json => {
      ServerActions.receivePodcasts(json.data.podcasts);
    });
  }
};