import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import './ShareButtons.css';
import { useSiteMetadata } from '../../util/useSiteMetadata';

const ShareButtons = ({ post }) => {
  const md = useSiteMetadata();

  const url = `${md.siteUrl}${post.fields.slug}`;
  const tags = post.frontmatter.tags || [];
  const title = post.frontmatter.title || md.title;
  const description = post.frontmatter.description || md.description;

  return (
    <div className="share-buttons">
      {
        md.social.twitter &&
        <TwitterShareButton
          url={url}
          className="share-button"
          title={title}
          via="dkomanov"
          hashtags={tags}
        >
          <TwitterIcon size={24} />
        </TwitterShareButton>
      }
      {
        md.social.facebook &&
        <FacebookShareButton
          url={url}
          className="share-button"
          quote={description}
          hashtag={tags.length ? `#${tags[0]}` : null}
        >
          <FacebookIcon size={24} />
        </FacebookShareButton>
      }
    </div>
  );
};

export default ShareButtons;
