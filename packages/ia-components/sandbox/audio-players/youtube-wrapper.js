import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, flatten, head } from 'lodash';
import flattenAlbumData from '../theatres/with-youtube-spotify/utils/flatten-album-data';
import getTrackListBySource from '../theatres/with-youtube-spotify/utils/get-track-list-by-source';
import YoutubePlayer from './players-by-type/YoutubePlayer';
import YoutubeTracklist from './youtube-tracklist/youtube-tracklist';
import styles from './styles/youtube-wrapper.less';
/**
 * Youtube Wrapper
 * Props:
 * @param object albumMetaData
 * @param array jwplayerPlaylist
 */

class YoutubeWrapper extends Component {
  constructor(props) {
    super(props);

    const { albumMetaData} = props;
    const albumData = flattenAlbumData(albumMetaData);
    const tracklistToShow=getTrackListBySource(albumData, "youtube");
  
    const tracklists=[];
    for (let index = 0; index < tracklistToShow.length; index++) {
      tracklists[index] = tracklistToShow[index].youtube.id;
    }
    this.state = {
      albumData,
      tracklistToShow,
      tracklists,
      channelToPlay: 'youtube',
      selectedTrack:6
    };
    this.onTrackSelected=this.onTrackSelected.bind(this);
  }
  onTrackSelected(trackNumber){
    this.setState({selectedTrack:trackNumber});    
  }
  render() {
    return (
      <div className="YoutubeWrapper">
        <YoutubePlayer
          tracklists={this.state.tracklists}
          selectedTrack={this.state.selectedTrack}
          />
        <YoutubeTracklist
            selectedTrack={this.state.selectedTrack}
            tracks={this.state.tracklistToShow}
            onSelected={(tn)=>{this.onTrackSelected(tn)}}
            />
      </div>
    );
  }
}

YoutubeWrapper.propTypes = {
  albumMetaData: PropTypes.object.isRequired,
  jwplayerPlaylist: PropTypes.array
};

export default YoutubeWrapper