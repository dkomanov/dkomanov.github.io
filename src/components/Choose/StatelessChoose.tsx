import React from 'react';
import './Choose.css';

export interface StatelessChooseItem<T> {
  label: string;
  value: T;
  default?: boolean;
}

export interface StatelessChooseProps<T> {
  label: string;
  items: StatelessChooseItem<T>[];
  value: T;
  onChange: (value: any) => any;
}

const StatelessSlider = <T,>({ label, items, value, onChange }: StatelessChooseProps<T>) => {
  const buttons = items.map((item) => (
    <li className={item.value === value ? 'active' : ''} key={item.value?.toString() || ''}>
      <a
        href={`#${item.label}`}
        onClick={(event) => {
          event.preventDefault();
          onChange(item.value);
        }}
      >
        {item.label}
      </a>
    </li>
  ));

  return (
    <div className="choose">
      {label && <label>{label}</label>}
      <ul className="horizontal">{buttons}</ul>
    </div>
  );
};

export default StatelessSlider;
