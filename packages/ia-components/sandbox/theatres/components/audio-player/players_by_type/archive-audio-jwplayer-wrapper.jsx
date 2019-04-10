import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * IA Audio Player
 *
 * Uses global: Play class (IA JWPlayer wrapper)
 *
 * It will display photo if given, and will overlay the media player at the base of the photo.
 */
class ArchiveAudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.jwPlayerInstance = React.createRef();

    // expecting jwplayer to be globally ready
    this.state = {
      player: null,
      playerPlaylistIndex: 0,
    };

    this.registerPlayer = this.registerPlayer.bind(this);
    this.onPlaylistItemCB = this.onPlaylistItemCB.bind(this);
    this.emitPlaylistChange = this.emitPlaylistChange.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  componentDidMount() {
    this.registerPlayer();
  }

  /**
   * Check if Track index has changed,
   * if so, then play that track
   */
  componentDidUpdate({ sourceData: { index: prevIndex } }, { playerPlaylistIndex: prevPlaylistIndex }) {
    const { player, playerPlaylistIndex } = this.state;
    const { sourceData: { index } } = this.props;

    const propsIndexChanged = prevIndex !== index;
    const playerIndexChanged = prevPlaylistIndex !== playerPlaylistIndex;
    const manuallyJumpToTrack = propsIndexChanged && !playerIndexChanged;

    if (manuallyJumpToTrack) {
      return player.playN(index);
    }

    return null;
  }

  /**
   * Event Handler that fires when JWPlayer starts a new track
   */
  onPlaylistItemCB({ index: eventIndex }) {
    const { sourceData: { index: sourceDataIndex } } = this.props;
    const controllerIndex = sourceDataIndex;
    const playerPlaylistIndex = eventIndex;
    if (controllerIndex === playerPlaylistIndex) return;

    this.setState({ playerPlaylistIndex }, this.emitPlaylistChange);
  }

  /**
   * Set up event handler for JWPlayer's custom events
   * This event handler returns JWPlayer's player instance
   *
   * @param { object } jwplayerInstance
   */
  onReady(jwplayerInstance) {
    const { backgroundPhoto, jwplayerID } = this.props;
    // User Play class instance to set event listeners
    const { player } = this.state;
    player.on('playlistItem', this.onPlaylistItemCB);

    if (backgroundPhoto) {
      // do not show waveform if there is a background photo
      // hack for now, until Play8 waveform toggle is working
      setTimeout(() => {
        // this timeout is necessary to trump Play8 setup.
        const jwplayerHolder = document.getElementById(jwplayerID);
        const style = 'height: 40px !important; background-color: black !important;';
        jwplayerHolder.setAttribute('style', style);
        const waveformBG = jwplayerHolder.querySelector('.jw-preview');
        waveformBG.setAttribute('style', 'background-image: none !important;');
      }, 0);
    }
  }

  /**
   * Register this instance of JWPlayer
   */
  registerPlayer() {
    const { jwplayerInfo, jwplayerID, backgroundPhoto } = this.props;
    const { jwplayerPlaylist, identifier, collection } = jwplayerInfo;

    const waveformer = backgroundPhoto ? null : 'jw-holder';
    // We are using IA custom global Player class to instatiate the player
    const baseConfig = {
      start: 0,
      embed: null,
      so: true,
      autoplay: false,
      width: 0,
      height: 0,
      list_height: 0,
      audio: true,
      responsive: true,
      identifier,
      collection,
      waveformer,
      hide_list: true,
      onReady: this.onReady
    };

    if (window.Play && Play) {
      const player = Play(jwplayerID, jwplayerPlaylist, baseConfig);
      this.setState({ player });
    }
  }

  /**
   * Fires callback `jwplayerPlaylistChange` given by props
   */
  emitPlaylistChange() {
    const { playerPlaylistIndex } = this.state;
    const { jwplayerPlaylistChange, backgroundPhoto, jwplayerID } = this.props;

    jwplayerPlaylistChange({ newTrackIndex: playerPlaylistIndex });

    if (backgroundPhoto) {
      // remove waveform, hack until Play8 waveform toggle is working
      setTimeout(() => {
        // this timeout is necessary to trump Play8 setup.
        const jwplayerHolder = document.getElementById(jwplayerID);
        const waveformBG = jwplayerHolder.querySelector('.jw-preview');
        waveformBG.setAttribute('style', 'background-image: none !important;');
      }, 400);
    }
  }

  render() {
    const {
      jwplayerID
    } = this.props;
    return (
      <div className="ia-player-wrapper">
        <div className="iaux-player-wrapper">
          <div id={jwplayerID} />
        </div>
      </div>
    );
  }
}

ArchiveAudioPlayer.defaultProps = {
  backgroundPhoto: '',
  photoAltTag: '',
  jwplayerID: '',
};

ArchiveAudioPlayer.propTypes = {
  backgroundPhoto: PropTypes.string,
  photoAltTag: PropTypes.string,
  jwplayerID: PropTypes.string,
  jwplayerPlaylistChange: PropTypes.func.isRequired,
  jwPlayerPlaylist: PropTypes.array.isRequired,
  jwplayerInfo: PropTypes.object.isRequired,
  sourceData: PropTypes.object.isRequired,
};

export default ArchiveAudioPlayer;
