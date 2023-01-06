import React from 'react';
import './Choose.css';

export interface StatelessChooseItem {
  label: string;
  value: string;
  default?: boolean;
}

export interface StatelessChooseProps {
  label: string;
  items: StatelessChooseItem[];
  value: string;
  onChange: (value: any) => any;
}

const StatelessSlider = ({ label, items, value, onChange }: StatelessChooseProps) => {
  const buttons = items.map((item) => (
    <li className={item.value === value ? 'active' : ''} key={item.value}>
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
