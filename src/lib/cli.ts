import prompt from 'prompt';
import colors from '@colors/colors';
import YouTube from './youtube';
import { YtResult } from '../types';

const youTube = new YouTube();

interface PromptResult {
  key: string;
  id?: string;
  query?: string;
  maxResults?: string;
}

const cli = {
  id(): void {
    prompt.start();
    prompt.get(['key', 'id'], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      const res = result as unknown as PromptResult;
      youTube.setKey(res.key);
      youTube.getById(res.id!, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  channelId(): void {
    prompt.start();
    prompt.get(['key', 'id'], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      const res = result as unknown as PromptResult;
      youTube.setKey(res.key);
      youTube.getChannelById(res.id!, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  search(): void {
    prompt.start();
    prompt.get(['key', 'query', 'maxResults'], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      const res = result as unknown as PromptResult;
      youTube.setKey(res.key);
      youTube.search.query(res.query!, parseInt(res.maxResults!, 10), (error: Error | null | undefined, data: YtResult | undefined) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  related(): void {
    prompt.start();
    prompt.get(['key', 'id', 'maxResults'], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      const res = result as unknown as PromptResult;
      youTube.setKey(res.key);
      youTube.related(res.id!, parseInt(res.maxResults!, 10), (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      });
    });
  },

  error(param: number): void {
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

export default cli;
export { cli };
