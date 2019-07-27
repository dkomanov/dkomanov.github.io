import {graphql, useStaticQuery} from 'gatsby';
import React from 'react';
import {FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton} from 'react-share';
import './ShareButtons.css';

const ShareButtons = ({post}) => {
  const data = useStaticQuery(graphql`
      query ShareButtonsQuery {
          site {
              siteMetadata {
                  siteUrl
                  title
                  social {
                      twitter
                      facebook
                  }
              }
          }
      }
  `);

  const {site: {siteMetadata: {siteUrl, title, social: {twitter, facebook}}}} = data;

  const url = `${siteUrl}${post.fields.slug}`;
  const tags = post.frontmatter.tags || [];

  return (
    <div className="share-buttons">
      {
        twitter &&
        <TwitterShareButton
          url={url}
          className="share-button"
          title={title}
          via="dkomanov"
          hashtags={tags}
        >
          <TwitterIcon size={24}/>
        </TwitterShareButton>
      }
      {
        facebook &&
        <FacebookShareButton
          url={url}
          className="share-button"
          quote={title}
          hashtag={tags.length ? `#${tags[0]}` : null}
        >
          <FacebookIcon size={24}/>
        </FacebookShareButton>
      }
    </div>
  );
};

export default ShareButtons;
