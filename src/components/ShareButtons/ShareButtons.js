import PropTypes from 'prop-types';
import React from 'react';
import {generateShareIcon, ShareButtons as ReactShareButtons} from 'react-share';
import {Config} from '../../util';
import './ShareButtons.css';

const {
  FacebookShareButton,
  TwitterShareButton
} = ReactShareButtons;

const FacebookIcon = Config.facebookName ? generateShareIcon('facebook') : null;
const TwitterIcon = Config.twitterName ? generateShareIcon('twitter') : null;

export default class ShareButtons extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const {post} = this.props;

    const url = Config.postUrl(post);
    const title = Config.postDescription(post);

    return (
      <div className="share-buttons">
        {
          Config.twitterName &&
          <TwitterShareButton
            url={url}
            className="share-button"
            title={title}
            via="dkomanov"
            hashtags={post.tags}
          >
            <TwitterIcon size={24}/>
          </TwitterShareButton>
        }
        {
          Config.facebookName &&
          <FacebookShareButton
            url={url}
            className="share-button"
            quote={title}
            hashtag={post.tags ? `#${post.tags[0]}` : null}
          >
            <FacebookIcon size={24}/>
          </FacebookShareButton>
        }
      </div>
    );
  }
}
