import { Link } from 'gatsby';
import React from 'react';
import { Layout, Markdown, Seo, EpisodeCard } from '../../components';
import cover from './cover.jpg';
import { listenedPodcastEpisodeFromGql } from '../../util/gql';
import { useSiteMetadata } from '../../util/useSiteMetadata';
import moment from 'moment';

const SingleEpisodePage = ({ location, pageContext: { node } }) => {
  const episode = listenedPodcastEpisodeFromGql(node);
  const { html } = node;
  const md = useSiteMetadata();
  const date = moment(episode.date).format('D MMMM, YYYY');

  return (
    <Layout location={location} teaserUrl={cover}>
      <Seo
        title={`${episode.title} - Short Review/Impression by ${md.author}`}
        description={`Short Review/Impression by ${md.author} of a podcast '${episode.title}', listened on ${date}.`}
      />
      <EpisodeCard episode={episode} />
      <Markdown html={html} />
      <p>
        <Link to="/what-i-listen">&larr; Back to list</Link>.
      </p>
    </Layout>
  );
};

export default SingleEpisodePage;
