import React, { useState } from 'react';
import './Choose.css';

export interface ChooseItem {
  label: string;
  value: string;
  default?: boolean;
}

export interface ChooseSliderProps {
  label: string;
  items: ChooseItem[];
  onChange: (value: string) => any;
}

const ChooseSlider = ({ label, items, onChange }: ChooseSliderProps) => {
  const [selected, selectedSet] = useState(
    items.findIndex((i) => i.default === true) || 0
  );

  return (
    <div className="choose">
      {label && <label>{label}</label>}
      <ul className="horizontal">
        <li>
          <small>{items[0].label}</small>
        </li>
        <li className="slider">
          <input
            type="range"
            min={0}
            max={items.length - 1}
            value={selected}
            onChange={(event) => {
              const index = parseInt(event.target.value, 10);
              selectedSet(index);
              if (onChange) {
                onChange(items[index].value);
              }
            }}
          />
        </li>
        <li>{items[selected].label}</li>
      </ul>
    </div>
  );
};

export default ChooseSlider;
