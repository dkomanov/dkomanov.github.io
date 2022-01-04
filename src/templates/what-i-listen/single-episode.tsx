import { Link } from 'gatsby';
import moment from 'moment';
import React from 'react';
import { EpisodeCard, Layout, Markdown, Seo } from '../../components';
import { listenedPodcastEpisodeFromGql } from '../../util/gql';
import { useSiteMetadata } from '../../util/useSiteMetadata';
import cover from './cover.jpg';

interface SingleEpisodePageProps {
  location: any;
  pageContext: {
    node: any;
  };
}

const SingleEpisodePage = ({
  location,
  pageContext: { node },
}: SingleEpisodePageProps) => {
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
