import PropTypes from 'prop-types';
import React from 'react';
import './Choose.css';

export default class Choose extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      default: PropTypes.bool
    })).isRequired,
    label: PropTypes.any,
    multiple: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    multiple: false
  };

  constructor(props) {
    super(props);

    const activeMap = {};
    props.items.forEach(i => activeMap[i.value] = i.default === true);
    if (!props.multiple && !props.items.find(i => i.default === true)) {
      activeMap[props.items.value] = true;
    }

    this.state = {
      activeMap
    };
  }

  render() {
    const { label, items } = this.props;
    const { activeMap } = this.state;

    const buttons = items.map((item, index) =>
      <li
        className={activeMap[item.value] === true ? 'active' : ''}
        key={index}
      >
        <a href={`#${item.label}`} onClick={event => this.handleOnClick(event, item)}>
          {item.label}
        </a>
      </li>
    );

    return (
      <div className="choose">
        {label && <label>{label}</label>}
        <ul className="horizontal">
          {buttons}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    const { activeMap } = this.state;
    const { multiple, onChange } = this.props;
    if (onChange) {
      if (multiple) {
        onChange(activeMap);
      } else {
        this.props.items.forEach(i => {
          if (activeMap[i.value] === true) {
            onChange(i.value);
          }
        });
      }
    }
  }

  handleOnClick = (event, item) => {
    event.preventDefault();

    const { activeMap } = this.state;
    const { items, multiple, onChange } = this.props;

    const newActiveMap = Object.assign({}, activeMap);
    if (multiple) {
      newActiveMap[item.value] = !activeMap[item.value];
      if (onChange) {
        onChange(newActiveMap);
      }
    } else {
      items.forEach(i => {
        newActiveMap[i.value] = false;
      });
      newActiveMap[item.value] = true;
      if (onChange) {
        onChange(item.value);
      }
    }

    this.setState({
      activeMap: newActiveMap
    });
  };
}
