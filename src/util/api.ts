import axios from 'axios';
import { CancelablePromise } from '.';

export function loadMarkdown(path: string) {
  return new CancelablePromise(
    axios({
      method: 'GET',
      url: path,
      responseType: 'text',
    })
  );
}

export function loadJson(path: string) {
  return new CancelablePromise(axios.get(path));
}
