import React from 'react';
import './Article.css';

interface ArticleProps {
  teaser?: React.ReactInstance;
  header: React.ReactInstance;
  content: React.ReactInstance;
  date?: string;
  meta?: React.ReactInstance;
}

const Article = ({ teaser, header, content, date, meta }: ArticleProps) => {
  return (
    <article
      className="post"
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <div className="article-item">
        {teaser && (
          <section className="post-teaser" itemProp="image">
            {teaser}
          </section>
        )}
        <header className="post-header">
          <h2 className="post-title" itemProp="name">
            {header}
          </h2>
        </header>
        <section className="post-description" itemProp="description">
          {content}
        </section>
        {(date || meta) && (
          <div className="post-meta">
            {date && <time dateTime={date}>{date}</time>}
            {meta}
          </div>
        )}
      </div>
    </article>
  );
};

export default Article;
