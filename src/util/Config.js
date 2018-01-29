import {StaticConfig} from '../content';

export default class Config {
  static domain = StaticConfig.domain;
  static baseUrl = StaticConfig.baseUrl;
  static title = StaticConfig.title;
  static logo = `${Config.baseUrl}${StaticConfig.logo}`;
  static coverImageUrl = `${Config.baseUrl}${StaticConfig.coverImageUrl}`;

  static disqus = StaticConfig.disqus;

  static twitterName = StaticConfig.twitterName;
  static facebookName = StaticConfig.facebookName;

  static postUrl = post => `${Config.domain}${Config.baseUrl}p/${post.url}`;
  static postDescription = post => post.description && post.description.length ? post.description : post.title;
}
