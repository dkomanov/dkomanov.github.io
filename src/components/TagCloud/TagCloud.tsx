import { Link } from 'gatsby';
import React from 'react';
import { TagCloud as ReactTagCloud } from 'react-tagcloud';
import './TagCloud.css';

interface TagCloudProps {
  tags: Tag[];
  urlFunc: (tag: Tag) => string;
}

const TagCloud = ({ tags, urlFunc }: TagCloudProps) => {
  return (
    <div className="tag-cloud">
      <ReactTagCloud
        minSize={12}
        maxSize={36}
        tags={tags}
        colorOptions={{
          luminosity: 'bright',
          hue: 'blue',
        }}
        renderer={(tag: Tag, size: string, color: string) => {
          return (
            <Link
              to={urlFunc(tag)}
              key={tag.value}
              style={{ color }}
              className={`tag-${size}`}
              title={tag.count}
            >
              {tag.value}
            </Link>
          );
        }}
      />
    </div>
  );
};

export default TagCloud;
