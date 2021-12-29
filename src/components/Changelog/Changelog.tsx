import React, { ReactElement } from 'react';
import { Button, Markdown } from '..';

interface RunInfo {
  date: string;
  comment: string | ReactElement;
}

interface ChangelogProps {
  runs: RunInfo[];
  onChange?: (string) => void;
}

const Changelog = ({ runs, onChange }: ChangelogProps) => {
  const handleOnClick = (event: React.MouseEvent, date: string) => {
    event.preventDefault();

    if (onChange) {
      onChange(date);
    }
  };

  const children = runs.map(({ date, comment }) =>
    <div key={date}>
      <h4>
        <Button onClick={event => handleOnClick(event, date)}>{date}</Button>
      </h4>
      {typeof comment === 'string' ? <Markdown html={comment} tiny /> : comment}
      <hr />
    </div>
  );

  return (
    <div>
      <h3>Changelog</h3>
      {children}
    </div>
  );
};

export default Changelog;
