import React from 'react';
import { EpisodeCard, Layout, Seo } from '../../components';
import { listenedPodcastEpisodeFromGql } from '../../util/gql';
import cover from './cover.jpg';

const EpisodeList = ({ location, pageContext: { nodes } }) => {
  // TODO PAGINATION
  const episodes = nodes.map((node) => listenedPodcastEpisodeFromGql(node));

  return (
    <Layout location={location} teaserUrl={cover}>
      <Seo
        title={`What I Listen`}
        description={`Short Reviews/Impressions about podcasts I listen.`}
      />
      <p className="disclaimer">
        <strong>Disclaimer:</strong> these are my quick notes, not full reviews
        on podcasts that I listen. I decided to do it to be more aware of what I
        listen to, to be more involved and forget less. Even if I write a lot,
        it's for sure doesn't represent episodes in its entirety.
      </p>
      <div className="episodes">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} />
        ))}
      </div>
    </Layout>
  );
};

export default EpisodeList;
