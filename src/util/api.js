import axios from 'axios';
import {CancelablePromise} from '.';

export function loadMarkdown(path) {
  return new CancelablePromise(axios({
    method: 'GET',
    url: path,
    responseType: 'text',
  }));
}

export function loadJson(path) {
  return new CancelablePromise(axios.get(path));
}
