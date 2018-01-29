import React from 'react';
import PropTypes from 'prop-types';
import './TeaserImage.css';

export default class TeaserImage extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      top: 0,
    }
  }

  render() {
    const {url} = this.props;
    const {top} = this.state;
    return (
      <div className="teaser-image">
        <div className="teaser-image_image" style={{
          backgroundImage: `url(${url})`,
          transform: `translate3d(0px, ${top / 3}px, 0px)`,
          opacity: 1 - Math.max(top / 700, 0),
        }}>
          Teaser Image
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = () => {
    // Consider using cross-browser code:
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
    const newTop = Math.floor(window.scrollY);

    if (newTop < 0 || newTop > 1500) {
      return;
    }

    const {top} = this.state;

    if (Math.floor(top / 3) !== Math.floor(newTop / 3)) {
      this.setState({top: newTop});
    }
  };
}
