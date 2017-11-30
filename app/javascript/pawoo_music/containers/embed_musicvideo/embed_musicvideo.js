import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import querystring from 'querystring';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Track from '../track';

import pawooIcon from '../../../images/pawoo_music/pawoo_icon.svg';

import '../app/app.scss';

const mapStateToProps = (state, { statusId }) => ({
  status: state.getIn(['statuses', statusId]),
  trackIsMounted: Immutable.List(['statuses', statusId, 'track']).equals(
    state.getIn(['pawoo_music', 'player', 'trackPath'])),
});

@connect(mapStateToProps)
export default class EmbedMusicvideo extends React.PureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    trackIsMounted: PropTypes.bool.isRequired,
  }

  state = {
    showIcon: false,
  };

  handleMouseEnter = () => {
    this.setState({ showIcon: true });
    this.hideLogoDebounce();
  }

  handleMouseMove = () => {
    this.setState({ showIcon: true });
    this.hideLogoDebounce();
  }

  handleMouseLeave = () => {
    this.setState({ showIcon: false });
  }

  hideLogoDebounce = debounce(() => {
    this.setState({ showIcon: false });
  }, 3000);

  renderInfo () {
    const { status, trackIsMounted } = this.props;
    const { showIcon } = this.state;
    const id = status.get('id');
    const account = status.get('account');
    const track = status.get('track');
    const params = location.search.length > 1 ? querystring.parse(location.search.substr(1)) : {};
    const hideInfo = params.hideinfo && Number(params.hideinfo) === 1;

    if (trackIsMounted) {
      return (
        <div className='meta'>
          <a className={classNames('icon-link', { visible: showIcon })} href={`/@${account.acct}/${id}`} target='_blank'>
            <img src={pawooIcon} alt='Pawoo Music' />
          </a>
        </div>
      );
    }

    if (!hideInfo) {
      return (
        <div className='meta'>
          <a className='artist' href={`/@${account.acct}`}       target='_blank'>{track.get('artist')}</a><br />
          <a className='title'  href={`/@${account.acct}/${id}`} target='_blank'>{track.get('title')} </a>
        </div>
      );
    }

    return (
      <div className='meta' />
    );
  }

  render () {
    const { status } = this.props;

    return (
      <div
        className='app embed-musicvideo'
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        <Track track={status.get('track')} fitContain />
        {this.renderInfo()}
      </div>
    );
  }

}
