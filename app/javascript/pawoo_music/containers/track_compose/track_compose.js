import classNames from 'classnames';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  changeTrackComposeTrackTitle,
  changeTrackComposeTrackArtist,
  changeTrackComposeTrackText,
  changeTrackComposeTrackMusic,
  changeTrackComposeTrackVideoBackgroundColor,
  changeTrackComposeTrackVideoImage,
  changeTrackComposeTrackVideoSpriteMovementCircleEnabled,
  changeTrackComposeTrackVideoSpriteMovementCircleRad,
  changeTrackComposeTrackVideoSpriteMovementCircleScale,
  changeTrackComposeTrackVideoSpriteMovementCircleSpeed,
  changeTrackComposeTrackVideoSpriteMovementRandomEnabled,
  changeTrackComposeTrackVideoSpriteMovementRandomScale,
  changeTrackComposeTrackVideoSpriteMovementRandomSpeed,
  changeTrackComposeTrackVideoSpriteMovementZoomEnabled,
  changeTrackComposeTrackVideoSpriteMovementZoomScale,
  changeTrackComposeTrackVideoSpriteMovementZoomSpeed,
  changeTrackComposeTrackVideoBlurVisibility,
  changeTrackComposeTrackVideoBlurMovementThreshold,
  changeTrackComposeTrackVideoBlurBlinkThreshold,
  changeTrackComposeTrackVideoParticleVisibility,
  changeTrackComposeTrackVideoParticleAlpha,
  changeTrackComposeTrackVideoParticleColor,
  changeTrackComposeTrackVideoParticleLimitThreshold,
  changeTrackComposeTrackVideoLightLeaksVisibility,
  changeTrackComposeTrackVideoLightLeaksAlpha,
  changeTrackComposeTrackVideoLightLeaksInterval,
  changeTrackComposeTrackVideoSpectrumVisiblity,
  changeTrackComposeTrackVideoSpectrumMode,
  changeTrackComposeTrackVideoSpectrumAlpha,
  changeTrackComposeTrackVideoSpectrumColor,
  changeTrackComposeTrackVideoTextVisibility,
  changeTrackComposeTrackVideoTextAlpha,
  changeTrackComposeTrackVideoTextColor,
  changeTrackComposeTrackVideoBannerVisibility,
  changeTrackComposeTrackVideoBannerAlpha,
  changeTrackComposePrivacy,
  submitTrackCompose,
} from '../../actions/track_compose';
import {
  changePaused,
  changeTrackPath,
} from '../../actions/player';
import { makeGetAccount } from '../../../mastodon/selectors';
import AudioInput from '../../components/audio_input';
import Musicvideo from '../musicvideo';
import Delay from '../../components/delay';
import Slider from '../../components/slider';
import Checkbox from '../../components/checkbox';
import {
  constructRgbObject,
  extractRgbFromRgbObject,
} from '../../util/musicvideo';
import { navigate } from '../../util/navigator';
import PrivacyDropdown from '../../../mastodon/features/compose/components/privacy_dropdown';
import GenreTagPicker from '../../components/genre_tag_picker';
import ColorTrigger from '../../components/color_trigger';
import ImageInput from '../../components/image_input';
import MusicCompose from '../../components/music_compose';
import { isMobile } from '../../util/is_mobile';

const messages = defineMessages({
  preview: { id: 'pawoo_music.track_compose.preview', defaultMessage: 'Video preview' },
  privacy: { id: 'pawoo_music.track_compose.privacy', defaultMessage: 'Privacy' },
  select_genre: { id: 'pawoo_music.track_compose.select_genre', defaultMessage: 'Select genre tag' },
});
const allowedPrivacy = ['public', 'unlisted'];
const isUserTouching = () => false;
const mobile = isMobile();

class Scrollable extends ImmutablePureComponent {

  renderThumbVertical({ className, ...props }) {
    return <div className={[className, 'thumb-vetical'].join(' ')} {...props} />;
  }

  render() {
    return mobile ? this.props.children : (
      <Scrollbars renderThumbVertical={this.renderThumbVertical}>
        {this.props.children}
      </Scrollbars>
    );
  }

}

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state) => ({
    tab: state.getIn(['pawoo_music', 'track_compose', 'tab']),
    track: state.getIn(['pawoo_music', 'track_compose', 'track']),
    pathToTrackBeingPlayed: state.getIn(['pawoo_music', 'player', 'trackPath']),
    error: state.getIn(['pawoo_music', 'track_compose', 'error']),
    isSubmitting: state.getIn(['pawoo_music', 'track_compose', 'is_submitting']),
    account: getAccount(state, state.getIn(['meta', 'me'])),
  });

  return mapStateToProps;
};


const mapDispatchToProps = (dispatch) => ({
  onChangeTrackPath (value) {
    dispatch(changeTrackPath(value));
  },

  onChangeTrackTitle (value) {
    dispatch(changeTrackComposeTrackTitle(value));
  },

  onChangeTrackArtist (value) {
    dispatch(changeTrackComposeTrackArtist(value));
  },

  onChangeTrackText (value) {
    dispatch(changeTrackComposeTrackText(value));
  },

  onChangeTrackMusic (value) {
    dispatch(changeTrackComposeTrackMusic(value));
  },

  onChangeTrackVideoBackgroundColor (value) {
    dispatch(changeTrackComposeTrackVideoBackgroundColor(value));
  },

  onChangeTrackVideoImage (value) {
    dispatch(changeTrackComposeTrackVideoImage(value));
  },

  onChangeTrackVideoSpriteMovementCircleEnabled (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementCircleEnabled(value));
  },

  onChangeTrackVideoSpriteMovementCircleRad (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementCircleRad(value));
  },

  onChangeTrackVideoSpriteMovementCircleScale (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementCircleScale(value));
  },

  onChangeTrackVideoSpriteMovementCircleSpeed (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementCircleSpeed(value));
  },

  onChangeTrackVideoSpriteMovementRandomEnabled (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementRandomEnabled(value));
  },

  onChangeTrackVideoSpriteMovementRandomScale (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementRandomScale(value));
  },

  onChangeTrackVideoSpriteMovementRandomSpeed (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementRandomSpeed(value));
  },

  onChangeTrackVideoSpriteMovementZoomEnabled (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementZoomEnabled(value));
  },

  onChangeTrackVideoSpriteMovementZoomScale (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementZoomScale(value));
  },

  onChangeTrackVideoSpriteMovementZoomSpeed (value) {
    dispatch(changeTrackComposeTrackVideoSpriteMovementZoomSpeed(value));
  },

  onChangeTrackVideoBlurVisibility (value) {
    dispatch(changeTrackComposeTrackVideoBlurVisibility(value));
  },

  onChangeTrackVideoBlurMovementThreshold (value) {
    dispatch(changeTrackComposeTrackVideoBlurMovementThreshold(value));
  },

  onChangeTrackVideoBlurBlinkThreshold (value) {
    dispatch(changeTrackComposeTrackVideoBlurBlinkThreshold(value));
  },

  onChangeTrackVideoParticleVisibility (value) {
    dispatch(changeTrackComposeTrackVideoParticleVisibility(value));
  },

  onChangeTrackVideoParticleAlpha (value) {
    dispatch(changeTrackComposeTrackVideoParticleAlpha(value));
  },

  onChangeTrackVideoParticleColor (value) {
    dispatch(changeTrackComposeTrackVideoParticleColor(value));
  },

  onChangeTrackVideoParticleLimitThreshold (value) {
    dispatch(changeTrackComposeTrackVideoParticleLimitThreshold(value));
  },

  onChangeTrackVideoLightLeaksVisibility (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksVisibility(value));
  },

  onChangeTrackVideoLightLeaksAlpha (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksAlpha(value));
  },

  onChangeTrackVideoLightLeaksInterval (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksInterval(value));
  },

  onChangeTrackVideoSpectrumVisibility (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumVisiblity(value));
  },

  onChangeTrackVideoSpectrumMode (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumMode(value));
  },

  onChangeTrackVideoSpectrumAlpha (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumAlpha(value));
  },

  onChangeTrackVideoSpectrumColor (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumColor(value));
  },

  onChangeTrackVideoTextVisibility (value) {
    dispatch(changeTrackComposeTrackVideoTextVisibility(value));
  },

  onChangeTrackVideoTextAlpha (value) {
    dispatch(changeTrackComposeTrackVideoTextAlpha(value));
  },

  onChangeTrackVideoTextColor (value) {
    dispatch(changeTrackComposeTrackVideoTextColor(value));
  },

  onChangeTrackVideoBannerVisibility (value) {
    dispatch(changeTrackComposeTrackVideoBannerVisibility(value));
  },

  onChangeTrackVideoBannerAlpha (value) {
    dispatch(changeTrackComposeTrackVideoBannerAlpha(value));
  },

  onChangePrivacy (value) {
    dispatch(changeTrackComposePrivacy(value));
  },

  onPause () {
    dispatch(changePaused(true));
  },

  onSubmit () {
    dispatch(submitTrackCompose());
  },
});

@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
export default class TrackCompose extends ImmutablePureComponent {

  static propTypes = {
    isActive: PropTypes.func,
    onReplace: PropTypes.func,
    onChangeTrackPath: PropTypes.func.isRequired,
    onChangeTrackTitle: PropTypes.func.isRequired,
    onChangeTrackArtist: PropTypes.func.isRequired,
    onChangeTrackText: PropTypes.func.isRequired,
    onChangeTrackMusic: PropTypes.func.isRequired,
    onChangeTrackVideoBackgroundColor: PropTypes.func.isRequired,
    onChangeTrackVideoImage: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementCircleEnabled: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementCircleRad: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementCircleScale: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementCircleSpeed: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementRandomEnabled: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementRandomScale: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementRandomSpeed: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementZoomEnabled: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementZoomScale: PropTypes.func.isRequired,
    onChangeTrackVideoSpriteMovementZoomSpeed: PropTypes.func.isRequired,
    onChangeTrackVideoBlurVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoBlurMovementThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoBlurBlinkThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoParticleVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoParticleAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoParticleColor: PropTypes.func.isRequired,
    onChangeTrackVideoParticleLimitThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksInterval: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumMode: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumColor: PropTypes.func.isRequired,
    onChangeTrackVideoTextVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoTextAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoTextColor: PropTypes.func.isRequired,
    onChangeTrackVideoBannerVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoBannerAlpha: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    track: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    account: ImmutablePropTypes.map.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  }

  static defaultProps = {
    onClose: false,
  }

  state = {
    trackMusicTitle: '',
    trackVideoImageTitle: '',
    visibleColorPicker: null,
  };

  colorPickers = {
    background: {
      path: ['video', 'backgroundcolor'],
      handleChange: ({ rgb }) => {
        this.props.onChangeTrackVideoBackgroundColor(extractRgbFromRgbObject(rgb));
      },
    },

    particle: {
      path: ['video', 'particle', 'color'],
      handleChange: ({ rgb }) => {
        this.props.onChangeTrackVideoParticleAlpha(rgb.a);
        this.props.onChangeTrackVideoParticleColor(extractRgbFromRgbObject(rgb));
      },
    },

    spectrum: {
      path: ['video', 'spectrum', 'color'],
      handleChange: ({ rgb }) => {
        this.props.onChangeTrackVideoSpectrumAlpha(rgb.a);
        this.props.onChangeTrackVideoSpectrumColor(extractRgbFromRgbObject(rgb));
      },
    },

    text: {
      path: ['video', 'text', 'color'],
      handleChange: ({ rgb }) => {
        this.props.onChangeTrackVideoTextAlpha(rgb.a);
        this.props.onChangeTrackVideoTextColor(extractRgbFromRgbObject(rgb));
      },
    },
  };

  componentWillMount () {
    this.props.onChangeTrackPath(['pawoo_music', 'track_compose', 'track']);
  }

  componentWillUnmount () {
    const { onChangeTrackPath, onPause, pathToTrackBeingPlayed } = this.props;

    if (Immutable.List(['pawoo_music', 'track_compose', 'track']).equals(pathToTrackBeingPlayed)) {
      onPause();
      onChangeTrackPath(null);
    }
  }

  componentWillReceiveProps ({ error, isSubmitting }) {
    // アップロードに成功した
    if (this.props.isSubmitting && !isSubmitting && !error) {
      this.handleCancel();
    }
  }

  handleChangeTrackMusic = (file) => {
    this.setState({ trackMusicTitle: file.name }, () => {
      this.props.onChangeTrackMusic(file);
    });
  };

  handleChangeTrackTitle = ({ target }) => {
    this.props.onChangeTrackTitle(target.value);
  }

  handleChangeTrackArtist = ({ target }) => {
    this.props.onChangeTrackArtist(target.value);
  }

  handleChangeTrackText = ({ target }) => {
    this.props.onChangeTrackText(target.value);
  }

  handleChangeTrackVideoImage = (file) => {
    this.setState({ trackVideoImageTitle: file.name }, () => {
      this.props.onChangeTrackVideoImage(file);
    });
  }

  handleChangeTrackVideoSpriteMovementCircleEnabled = ({ target }) => {
    this.props.onChangeTrackVideoSpriteMovementCircleEnabled(target.checked);
  }

  handleChangeTrackVideoSpriteMovementCircleRad = (value) => {
    this.props.onChangeTrackVideoSpriteMovementCircleRad(value);
  }

  handleChangeTrackVideoSpriteMovementCircleScale = (value) => {
    this.props.onChangeTrackVideoSpriteMovementCircleScale(value);
  }

  handleChangeTrackVideoSpriteMovementCircleSpeed = (value) => {
    this.props.onChangeTrackVideoSpriteMovementCircleSpeed(value);
  }

  handleChangeTrackVideoSpriteMovementRandomEnabled = ({ target }) => {
    this.props.onChangeTrackVideoSpriteMovementRandomEnabled(target.checked);
  }

  handleChangeTrackVideoSpriteMovementRandomScale = (value) => {
    this.props.onChangeTrackVideoSpriteMovementRandomScale(value);
  }

  handleChangeTrackVideoSpriteMovementRandomSpeed = (value) => {
    this.props.onChangeTrackVideoSpriteMovementRandomSpeed(value);
  }

  handleChangeTrackVideoSpriteMovementZoomEnabled = ({ target }) => {
    this.props.onChangeTrackVideoSpriteMovementZoomEnabled(target.checked);
  }

  handleChangeTrackVideoSpriteMovementZoomScale = (value) => {
    this.props.onChangeTrackVideoSpriteMovementZoomScale(value);
  }

  handleChangeTrackVideoSpriteMovementZoomSpeed = (value) => {
    this.props.onChangeTrackVideoSpriteMovementZoomSpeed(value);
  }

  handleToggleBackgroundColorPickerVisible = () => {
    this.setState({ visibleColorPicker: 'background' }, this.handleBindColorPickerHide);
  }

  handleChangeTrackVideoBackgroundColor = ({ rgb }) => {
    this.props.onChangeTrackVideoBackgroundColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackVideoBlurVisibility = ({ target }) => {
    this.props.onChangeTrackVideoBlurVisibility(target.checked);
  }

  handleChangeTrackBlurMovementThreshold = (value) => {
    this.props.onChangeTrackVideoBlurMovementThreshold(value);
  }

  handleChangeTrackVideoBlurBlinkThreshold = (value) => {
    this.props.onChangeTrackVideoBlurBlinkThreshold(value);
  }

  handleChangeTrackVideoParticleVisibility = ({ target }) => {
    this.props.onChangeTrackVideoParticleVisibility(target.checked);
  }

  handleChangeTrackVideoParticleLimitThreshold = (value) => {
    this.props.onChangeTrackVideoParticleLimitThreshold(value);
  }

  handleChangeTrackVideoParticleColor = ({ rgb }) => {
    this.props.onChangeTrackVideoParticleAlpha(rgb.a);
    this.props.onChangeTrackVideoParticleColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackVideoLightLeaksVisibility = ({ target }) => {
    this.props.onChangeTrackVideoLightLeaksVisibility(target.checked);
  }

  handleChangeTrackVideoLightLeaksAlpha = (value) => {
    this.props.onChangeTrackVideoLightLeaksAlpha(value);
  }

  handleChangeTrackVideoLightLeaksInterval = (value) => {
    this.props.onChangeTrackVideoLightLeaksInterval(value);
  }

  handleChangeTrackVideoLightLeaksColor = ({ rgb }) => {
    this.props.onChangeTrackVideoLightLeaksAlpha(rgb.a);
  }

  handleChangeTrackVideoSpectrumVisibility = ({ target }) => {
    this.props.onChangeTrackVideoSpectrumVisibility(target.checked);
  }

  handleChangeTrackVideoSpectrumMode = ({ target }) => {
    if (target.checked) {
      this.props.onChangeTrackVideoSpectrumMode(Number(target.value));
    }
  }

  handleChangeTrackVideoSpectrumColor = ({ rgb }) => {
    this.props.onChangeTrackVideoSpectrumAlpha(rgb.a);
    this.props.onChangeTrackVideoSpectrumColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackComposeTrackVideoTextVisibility = ({ target }) => {
    this.props.onChangeTrackVideoTextVisibility(target.checked);
  }

  handleChangeTrackComposeTrackVideoTextColor = ({ rgb }) => {
    this.props.onChangeTrackVideoTextAlpha(rgb.a);
    this.props.onChangeTrackVideoTextColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackVideoBannerVisibility = ({ target }) => {
    this.props.onChangeTrackVideoBannerVisibility(target.checked);
  }

  handleChangeTrackVideoBannerAlpha = (value) => {
    this.props.onChangeTrackVideoBannerAlpha(value);
  }

  handleBindColorPickerHide = () => {
    document.addEventListener('click', this.handleColorPickerHide, false);
  };

  handleUnbindColorPickerHide = () => {
    document.removeEventListener('click', this.handleColorPickerHide, false);
  };

  handleColorPickerHide = (event) => {
    let node = event.target;
    let inside = false;
    while (node.tagName !== 'BODY') {
      if (/color-picker/.test(node.className)) {
        inside = true;
        break;
      }
      node = node.parentNode;
    }
    if (!inside) {
      this.setState({ visibleColorPicker: null }, this.handleUnbindColorPickerHide);
    }
  };

  handleToggleParticleColorPickerVisible = () => {
    this.setState({ visibleColorPicker: 'particle' }, this.handleBindColorPickerHide);
  };

  handleToggleSpectrumColorPickerVisible = () => {
    this.setState({ visibleColorPicker: 'spectrum' }, this.handleBindColorPickerHide);
  };

  handleToggleTextColorPickerVisible = () => {
    this.setState({ visibleColorPicker: 'text' }, this.handleBindColorPickerHide);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  handleCancel = () => {
    const { account, track, onClose } = this.props;

    if (typeof onClose === 'function') {
      onClose();
    } else {
      const id = track.get('id');

      navigate(id ? `/@${account.get('acct')}/${id}` : '/');
    }
  }

  handleChangePrivacy = (value) => {
    this.props.onChangePrivacy(value);
  }

  handleSelectGenre = (genre) => {
    this.props.onChangeTrackText(`${this.props.track.get('text')} #${genre}`);
  }

  render () {
    const { isActive, onReplace, track, intl } = this.props;
    const { trackMusicTitle, trackVideoImageTitle } = this.state;

    return (
      <MusicCompose isActive={isActive} onReplace={onReplace}>
        <div className={classNames('track-compose-content', { mobile })}>
          <div className='musicvideo-preview'>
            <Musicvideo label={intl.formatMessage(messages.preview)} />
          </div>
          <div className='form-content'>
            <div className='scrollable-wrapper'>
              <div>
                <Scrollable>
                  <form>

                    {/* 音楽選択から画像選択まで */}
                    <fieldset>
                      <legend>
                        <AudioInput
                          onChange={this.handleChangeTrackMusic}
                          title={trackMusicTitle}
                        />
                      </legend>

                      <legend>
                        <div className='track-compose-text-input'>
                          <label className=''>
                            {this.props.track.get('title').length === 0 && (
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.basic.title'
                                  defaultMessage='Title'
                                />
                              </span>
                            )}
                            <input
                              maxLength='128'
                              onChange={this.handleChangeTrackTitle}
                              required
                              size='32'
                              type='text'
                              value={this.props.track.get('title')}
                            />
                          </label>
                        </div>
                      </legend>

                      <legend>
                        <div className='track-compose-text-input'>
                          <label className=''>
                            {this.props.track.get('artist').length === 0 && (
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.basic.artist'
                                  defaultMessage='Artist'
                                />
                              </span>
                            )}
                            <input
                              maxLength='128'
                              onChange={this.handleChangeTrackArtist}
                              required
                              size='32'
                              type='text'
                              value={this.props.track.get('artist')}
                            />
                          </label>
                        </div>
                      </legend>

                      <legend>
                        <div className='track-compose-text-textarea'>
                          <label className=''>
                            {this.props.track.get('text').length === 0 && (
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.basic.details'
                                  defaultMessage='Details'
                                />
                              </span>
                            )}
                            <textarea
                              maxLength='500'
                              onChange={this.handleChangeTrackText}
                              value={this.props.track.get('text')}
                            />
                          </label>
                        </div>
                        <GenreTagPicker onSelectGenre={this.handleSelectGenre} />
                      </legend>

                      <legend>
                        <ImageInput
                          onChange={this.handleChangeTrackVideoImage}
                          title={trackVideoImageTitle}
                        />
                      </legend>
                    </fieldset>

                    <div className='horizontal'>
                      <span className='text'>
                        <FormattedMessage
                          id='pawoo_music.track_compose.video.background_color'
                          defaultMessage='Background color'
                        />
                      </span>
                      <ColorTrigger
                        alpha={1}
                        color={this.props.track.getIn(['video', 'backgroundcolor'])}
                        onClick={this.handleToggleBackgroundColorPickerVisible}
                      />
                    </div>

                    {/* Sprite circular movement */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'sprite', 'movement', 'circle', 'enabled'])} onChange={this.handleChangeTrackVideoSpriteMovementCircleEnabled}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.sprite.movement.circle'
                              defaultMessage='Horizontal animation'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'sprite', 'movement', 'circle', 'enabled']) && (
                          <div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.rad'
                                  defaultMessage='Angle'
                                />
                              </span>
                              <Slider
                                min={Math.PI / 512}
                                max={Math.PI / 4}
                                step={Math.PI / 512}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'circle', 'rad'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementCircleRad}
                              />
                            </div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.scale'
                                  defaultMessage='Scale'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'circle', 'scale'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementCircleScale}
                              />
                            </div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.speed'
                                  defaultMessage='Speed'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'circle', 'speed'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementCircleSpeed}
                              />
                            </div>
                          </div>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Sprite random movement */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'sprite', 'movement', 'random', 'enabled'])} onChange={this.handleChangeTrackVideoSpriteMovementRandomEnabled}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.sprite.movement.random'
                              defaultMessage='Random animation'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'sprite', 'movement', 'random', 'enabled']) && (
                          <div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.scale'
                                  defaultMessage='Scale'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'random', 'scale'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementRandomScale}
                              />
                            </div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.speed'
                                  defaultMessage='Speed'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'random', 'speed'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementRandomSpeed}
                              />
                            </div>
                          </div>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Sprite zoom movement */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'sprite', 'movement', 'zoom', 'enabled'])} onChange={this.handleChangeTrackVideoSpriteMovementZoomEnabled}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.sprite.movement.zoom'
                              defaultMessage='Zoom animation'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'sprite', 'movement', 'zoom', 'enabled']) && (
                          <div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.scale'
                                  defaultMessage='Scale'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'zoom', 'scale'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementZoomScale}
                              />
                            </div>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.sprite.movement.speed'
                                  defaultMessage='Speed'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'sprite', 'movement', 'zoom', 'speed'])}
                                onChange={this.handleChangeTrackVideoSpriteMovementZoomSpeed}
                              />
                            </div>
                          </div>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Spectrum */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'spectrum', 'visible'])} onChange={this.handleChangeTrackVideoSpectrumVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.spectrum'
                              defaultMessage='Spectrum'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'spectrum', 'visible']) && (
                          <legend className='track-compose-effect'>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.spectrum_form'
                                  defaultMessage='Form'
                                />
                              </span>
                              <div className='horizontal track-compose-radio'>
                                <Checkbox circled value='1' checked={this.props.track.getIn(['video', 'spectrum', 'mode']) === 1} onChange={this.handleChangeTrackVideoSpectrumMode}>
                                  <FormattedMessage
                                    id='pawoo_music.track_compose.video.circle_columns'
                                    defaultMessage='Columns around circle'
                                  />
                                </Checkbox>
                                <Checkbox circled value='2' checked={this.props.track.getIn(['video', 'spectrum', 'mode']) === 2} onChange={this.handleChangeTrackVideoSpectrumMode}>
                                  <FormattedMessage
                                    id='pawoo_music.track_compose.video.circle'
                                    defaultMessage='Circle'
                                  />
                                </Checkbox>
                                <Checkbox circled value='0' checked={this.props.track.getIn(['video', 'spectrum', 'mode']) === 0} onChange={this.handleChangeTrackVideoSpectrumMode}>
                                  <FormattedMessage
                                    id='pawoo_music.track_compose.video.bottom_columns'
                                    defaultMessage='Columns at the bottom'
                                  />
                                </Checkbox>
                                <Checkbox circled value='3' checked={this.props.track.getIn(['video', 'spectrum', 'mode']) === 3} onChange={this.handleChangeTrackVideoSpectrumMode}>
                                  <FormattedMessage
                                    id='pawoo_music.track_compose.video.bottom_fill'
                                    defaultMessage='Filled graph at the bottom'
                                  />
                                </Checkbox>
                              </div>
                            </div>

                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.color'
                                  defaultMessage='Color'
                                />
                              </span>
                              <ColorTrigger
                                alpha={this.props.track.getIn(['video', 'spectrum', 'alpha'])}
                                color={this.props.track.getIn(['video', 'spectrum', 'color'])}
                                onClick={this.handleToggleSpectrumColorPickerVisible}
                              />
                            </div>
                          </legend>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Blur */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'blur', 'visible'])} onChange={this.handleChangeTrackVideoBlurVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.blur'
                              defaultMessage='Blur'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'blur', 'visible']) && (
                          <legend className='track-compose-effect'>
                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.movement_threshold'
                                  defaultMessage='Movement'
                                />
                              </span>
                              <Slider
                                min={128}
                                max={256}
                                value={this.props.track.getIn(['video', 'blur', 'movement', 'threshold'])}
                                onChange={this.handleChangeTrackBlurMovementThreshold}
                              />
                            </label>
                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.blink_threshold'
                                  defaultMessage='Blink'
                                />
                              </span>
                              <Slider
                                min={128}
                                max={256}
                                value={this.props.track.getIn(['video', 'blur', 'blink', 'threshold'])}
                                onChange={this.handleChangeTrackVideoBlurBlinkThreshold}
                              />
                            </label>
                          </legend>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Particle */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'particle', 'visible'])} onChange={this.handleChangeTrackVideoParticleVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.particle'
                              defaultMessage='Particle'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'particle', 'visible']) && (
                          <legend className='track-compose-effect'>
                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.limit_threshold'
                                  defaultMessage='Limit'
                                />
                              </span>
                              <Slider
                                min={128}
                                max={256}
                                value={this.props.track.getIn(['video', 'particle', 'limit', 'threshold'])}
                                onChange={this.handleChangeTrackVideoParticleLimitThreshold}
                              />
                            </label>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.color'
                                  defaultMessage='Color'
                                />
                              </span>
                              <ColorTrigger
                                alpha={this.props.track.getIn(['video', 'particle', 'alpha'])}
                                color={this.props.track.getIn(['video', 'particle', 'color'])}
                                onClick={this.handleToggleParticleColorPickerVisible}
                              />
                            </div>
                          </legend>
                        )}
                      </Delay>
                    </fieldset>

                    {/* LightLeak */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'lightleaks', 'visible'])} onChange={this.handleChangeTrackVideoLightLeaksVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.lightleaks'
                              defaultMessage='Light leaks'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'lightleaks', 'visible']) && (
                          <legend className='track-compose-effect'>
                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.lightleaks_alpha'
                                  defaultMessage='Opacity'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'lightleaks', 'alpha'])}
                                onChange={this.handleChangeTrackVideoLightLeaksAlpha}
                              />
                            </label>

                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.interval'
                                  defaultMessage='Interval'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={60}
                                step={0.1}
                                value={this.props.track.getIn(['video', 'lightleaks', 'interval'])}
                                onChange={this.handleChangeTrackVideoLightLeaksInterval}
                              />
                            </label>
                          </legend>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Text */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'text', 'visible'])} onChange={this.handleChangeTrackComposeTrackVideoTextVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.text'
                              defaultMessage='Text'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480} className='legend'>
                        {this.props.track.getIn(['video', 'text', 'visible']) && (
                          <legend className='track-compose-effect'>
                            <div className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.color'
                                  defaultMessage='Color'
                                />
                              </span>
                              <ColorTrigger
                                alpha={this.props.track.getIn(['video', 'text', 'alpha'])}
                                color={this.props.track.getIn(['video', 'text', 'color'])}
                                onClick={this.handleToggleTextColorPickerVisible}
                              />
                            </div>
                          </legend>
                        )}
                      </Delay>
                    </fieldset>

                    {/* Banner */}
                    <fieldset>
                      <legend>
                        <label className='horizontal'>
                          <Checkbox checked={this.props.track.getIn(['video', 'banner', 'visible'])} onChange={this.handleChangeTrackVideoBannerVisibility}>
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.banner'
                              defaultMessage='"made with Pawoo Music" banner (only for exported video)'
                            />
                          </Checkbox>
                        </label>
                      </legend>

                      <Delay duration={480}>
                        {this.props.track.getIn(['video', 'banner', 'visible']) && (
                          <div>
                            <p>
                              <FormattedMessage
                                id='pawoo_music.track_compose.video.banner_note'
                                defaultMessage='The banner will be shown only at the beginning of the video.'
                              />
                            </p>
                            <label className='horizontal'>
                              <span className='text'>
                                <FormattedMessage
                                  id='pawoo_music.track_compose.video.banner_alpha'
                                  defaultMessage='Opacity'
                                />
                              </span>
                              <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.props.track.getIn(['video', 'banner', 'alpha'])}
                                onChange={this.handleChangeTrackVideoBannerAlpha}
                              />
                            </label>
                          </div>
                        )}
                      </Delay>
                    </fieldset>

                    <div className='caution'>
                      <b>作品（画像、音源、楽曲、テキスト等を含む）のアップロードにおいて、下記の注意事項を守ることを誓います。</b><br />
                      <br />
                      １．この作品をインターネットで配信することが、第三者のいかなる権利も侵害しないこと。<br />
                      <br />
                      ２．マストドンというソフトウェアの仕様上、この作品が自動で他の様々なマストドンインスタンスにも複製され、配信されることに同意すること。<br />
                      （前提として、マストドンのソフトウェアの規約上、複製された作品を第三者が商用利用する行為は禁止されています。権利を侵害する行為は関連法令により罰せられることがあります。）<br />
                      <br />
                      ３．この楽曲のインターネットでの配信（インタラクティブ配信）に係る権利について、著作権等管理団体に管理委託または信託していないこと。<br />
                      <br />
                      ４．楽曲のアップロード後に、当該楽曲のインターネットでの配信（インタラクティブ配信）に係る権利の管理を第三者に委託した場合は、管理委託・信託契約の効力発生日前に、当サービスからアップロードした作品を削除すること。<br />
                      <br />
                      ５．他人の作品を許可なくアップロードしたことにより、当サービスまたは第三者に損害を与えたときは、当該アップロード者が一切の責任を負うものとし、当社はその一切の責任を負いません。
                    </div>
                  </form>
                </Scrollable>
              </div>
            </div>

            <div className='actions'>
              <button className='cancel' onClick={this.handleCancel}>
                <FormattedMessage id='pawoo_music.track_compose.cancel' defaultMessage='Cancel' />
              </button>
              {!track.get('id') && <PrivacyDropdown buttonClassName='privacy-toggle' value={track.get('visibility')} onChange={this.handleChangePrivacy} text={intl.formatMessage(messages.privacy)} allowedPrivacy={allowedPrivacy} isUserTouching={isUserTouching} />}
              <button className={classNames('submit', { disabled: this.props.isSubmitting })} disabled={this.props.isSubmitting} onClick={this.handleSubmit}>
                {track.get('id') ? (
                  <FormattedMessage id='pawoo_music.track_compose.save' defaultMessage='Save' />
                ) : (
                  <FormattedMessage id='pawoo_music.track_compose.submit' defaultMessage='Submit' />
                )}
              </button>
            </div>

            <Delay className='color-picker'>
              {this.state.visibleColorPicker !== null && (
                <SketchPicker
                  color={constructRgbObject(this.props.track.getIn(this.colorPickers[this.state.visibleColorPicker].path), 1)}
                  disableAlpha
                  onChange={this.colorPickers[this.state.visibleColorPicker].handleChange}
                />
              )}
            </Delay>
          </div>
        </div>
      </MusicCompose>
    );
  }

}
