import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusContainer from '../status';
import AccountContainer from '../account';
import { FormattedMessage } from 'react-intl';
import Link from '../../components/link_wrapper';
import DisplayName from '../../components/display_name';
import { makeGetNotification } from '../../../mastodon/selectors';

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification();

  const mapStateToProps = (state, props) => ({
    notification: getNotification(state, props.notification, props.accountId),
  });

  return mapStateToProps;
};

@connect(makeMapStateToProps)
export default class Notification extends ImmutablePureComponent {

  static propTypes = {
    notification: ImmutablePropTypes.map.isRequired,
  };

  renderFollow (account, link) {
    return (
      <div className='notification notification-follow'>
        <div className='message'>
          <i className='fa fa-fw fa-user-plus' />
          <FormattedMessage id='notification.follow' defaultMessage='{name} followed you' values={{ name: link }} />
        </div>

        <AccountContainer id={account.get('id')} withNote={false} />
      </div>
    );
  }

  renderMention (notification) {
    return <StatusContainer id={notification.get('status')} withDismiss />;
  }

  renderFavourite (notification, link) {
    const prepend = (
      <div className='prepend-inline'>
        <i className='fa fa-fw fa-star star-icon' />
        <FormattedMessage id='notification.favourite' defaultMessage='{name} favourited your status' values={{ name: link }} />
      </div>
    );

    return (
      <StatusContainer id={notification.get('status')} prepend={prepend} muted withDismiss />
    );
  }

  renderReblog (notification, link) {
    const prepend = (
      <div className='prepend-inline'>
        <i className='fa fa-fw fa-retweet' />
        <FormattedMessage id='notification.reblog' defaultMessage='{name} boosted your status' values={{ name: link }} />
      </div>
    );

    return (
      <StatusContainer id={notification.get('status')} prepend={prepend} muted withDismiss />
    );
  }

  render () {
    const { notification } = this.props;
    const account          = notification.get('account');
    const link             = (
      <Link to={`/@${account.get('acct')}`}>
        <DisplayName account={account} />
      </Link>
    );

    switch(notification.get('type')) {
    case 'follow':
      return this.renderFollow(account, link);
    case 'mention':
      return this.renderMention(notification);
    case 'favourite':
      return this.renderFavourite(notification, link);
    case 'reblog':
      return this.renderReblog(notification, link);
    }

    return null;
  }

}
