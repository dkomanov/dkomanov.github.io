import React from 'react';
import { Layout, Seo, TagCloud } from '../../components';
import cover from './cover.jpg';

interface EpisodeTagCloudPageProps {
  location: any;
  pageContext: {
    tags: Tag[];
  };
}

const EpisodeTagCloudPage = ({
  location,
  pageContext: { tags },
}: EpisodeTagCloudPageProps) => {
  return (
    <Layout location={location} teaserUrl={cover}>
      <Seo
        title={`What I Listen`}
        description={`Short Reviews/Impressions about podcasts I listen.`}
      />
      <h1>Tag Cloud of What I Listen</h1>
      <TagCloud
        tags={tags}
        urlFunc={(tag: Tag) => `/what-i-listen/tag/${tag.value}`}
      />
    </Layout>
  );
};

export default EpisodeTagCloudPage;
