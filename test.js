var elasticsearch = require('elasticsearch');

var messages = [];

var client = new elasticsearch.Client();
client.search({
  index: 'vision',
  type: 'message',
  scroll: '30s',
  body: {
    query: {
      bool: {
        must: [
          {
            term: { tripId: '148617' }
          }
        ]
      }
    }
  },
}, function getMore(error, response) {
  response.hits.hits.forEach(function (hit) {
    messages.push(hit._source);
  });

  if (response.hits.total !== messages.length) {
    client.scroll({
      scrollId: response._scroll_id,
      scroll: '30s'
    }, getMore);
  }
  else {
    console.log(messages);
  }
});
