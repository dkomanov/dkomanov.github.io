import {BlogPosts} from '../content';

export function getAllBlogPosts() {
  if (window.location.hostname === 'localhost') {
    return BlogPosts;
  } else {
    return BlogPosts.filter(p => !p.draft);
  }
}
