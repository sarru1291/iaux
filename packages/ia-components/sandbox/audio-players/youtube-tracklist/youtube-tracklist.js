import React, { Component } from 'react';
import PropTypes from 'prop-types';

class YoutubeTracklist extends Component {
  constructor(props){
    super(props);
    const {selectedTrack, onSelected, tracks} = props;
    this.state={
      selectedTrack,
      tracks,
      onSelected
    } 
  }
 
  trackButton = (selectedTrack, thisTrack, onSelected) => {
    const { trackNumber, length, formattedLength, title, artist } = thisTrack;
  
    return (
      <button
        type="button"
        trackNumber={trackNumber}
        className="track-button"
        onClick={(e)=>{onSelected(trackNumber)}}
      >
        <span className="track-number">{trackNumber}</span>
        <span className="track-title">{title}</span>
        <span className="track-length">{formattedLength}</span>
      </button>
    );
  };
  
  render() {
  if (!this.state.tracks.length) return <p className="no-tracks">No tracks to display.</p>;

  return (
    <div className="youtube-tracklist">
        {
          this.state.tracks.map((thisTrack) => {
            return this.trackButton(this.state.selectedTrack,thisTrack,this.state.onSelected)
          })
        }
    </div>
  );
  }
}

YoutubeTracklist.propTypes = {
  onSelected: PropTypes.func.isRequired,
  selectedTrack: PropTypes.number.isRequired,
  tracks: PropTypes.array
};

export default YoutubeTracklist;