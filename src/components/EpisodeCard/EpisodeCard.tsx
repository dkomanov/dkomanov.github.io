import React from 'react';
import { Link } from 'gatsby';
import { Article } from '../../components';
import moment from 'moment';
import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';
import { ListenedPodcastEpisode } from '../../util/gql';

// https://pixabay.com/vectors/headphones-microphone-record-music-4537928/

interface EpisodeCardProps {
  episode: ListenedPodcastEpisode;
}

const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  const date = moment(episode.date).format('D MMMM, YYYY');
  return (
    <Article
      teaser={
        <Link to={episode.slug}>
          {episode.teaser ? (
            <GatsbyImage image={episode.teaser} alt={episode.title} />
          ) : (
            <StaticImage
              src="missing.png"
              alt={episode.title}
              width={100}
              height={100}
            />
          )}
        </Link>
      }
      header={<Link to={episode.slug}>{episode.title}</Link>}
      content={
        <p>
          <a href={episode.url}>Aired</a>
          {' on '}
          {moment(episode.podcastDate).format('D MMMM, YYYY')}
          <br />
          Listened on {date}
        </p>
      }
    />
  );
};

export default EpisodeCard;
