import { getImage } from 'gatsby-plugin-image';

export interface ListenedPodcastEpisode {
  slug: string;
  title: string;
  date: Date;
  podcastDate: Date;
  url: string;
  teaser?: any;
  tags: string[];
  draft: boolean;
}

export function listenedPodcastEpisodeFromGql(
  node: any
): ListenedPodcastEpisode {
  return {
    slug: node.fields.slug,
    date: node.frontmatter.date,
    title: node.frontmatter.title,
    podcastDate: node.frontmatter.podcastDate,
    url: node.frontmatter.url,
    teaser: getImage(node.frontmatter.teaser),
    tags: node.frontmatter.tags || [],
    draft: node.frontmatter.draft,
  };
}
