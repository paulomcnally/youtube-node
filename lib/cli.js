const prompt = require('prompt');
const colors = require('@colors/colors');
const YouTube = require('./youtube');

const youTube = new YouTube();

const cli = {
  id() {
    prompt.start();
    prompt.get(['key', 'id'], (err, result) => {
      youTube.setKey(result.key);
      youTube.getById(result.id, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  channelId() {
    prompt.start();
    prompt.get(['key', 'id'], (err, result) => {
      youTube.setKey(result.key);
      youTube.getChannelById(result.id, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  search() {
    prompt.start();
    prompt.get(['key', 'query', 'maxResults'], (err, result) => {
      youTube.setKey(result.key);
      youTube.search(result.query, result.maxResults, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  related() {
    prompt.start();
    prompt.get(['key', 'id', 'maxResults'], (err, result) => {
      youTube.setKey(result.key);
      youTube.related(result.id, result.maxResults, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  error(param) {
    let message = '';
    switch (param) {
      case 0:
        message = 'Required to enter a command.';
        break;
      case 1:
        message = 'The command you entered does not exist.';
        break;
      default:
        message = 'Unknown error.';
        break;
    }
    console.log(colors.red(message));
  },
};

module.exports = cli;
