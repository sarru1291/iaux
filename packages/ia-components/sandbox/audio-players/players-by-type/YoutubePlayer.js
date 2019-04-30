import React, { Component} from 'react'
import PropTypes from 'prop-types'

 export default class YoutubePlayer extends Component {
  state={
    playerAnchor:React.createRef(),
    YTPlayer:null,
    tracklists:this.props.tracklists,
    selectedTrack:this.props.selectedTrack
  }
  componentDidMount(){
    this.loadAPI();
    const YTPlayer=this.loadPlayer(this.state.tracklists,this.state.selectedTrack);
    this.setState({YTPlayer});
  }
 
  loadPlayer(tracklists,selectedTrack){
    let YTPlayer;
    let videoIds='';
    for (let index = 0; index < tracklists.length; index++) {
      videoIds=videoIds+tracklists[index]+','
    }
    let currentVideoId=tracklists[selectedTrack];
    window.onYouTubeIframeAPIReady=()=>{
      YTPlayer=new window.YT.Player(this.state.playerAnchor.current,{
        height: this.props.height || 390,
        width: this.props.width || 640,
        videoId: currentVideoId,
        playerVars:{
          modestbranding:1,
          autoplay:0,
          enablejsapi:1,
          playlist:videoIds,
          rel:0
        },
        events: {
          onReady: this.onPlayerReady
        }
      })
    }
    return YTPlayer;
  }
  loadAPI(){
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  render () {
  
    return (
      <div className='YoutubePlayer'>
        <div ref={ this.state.playerAnchor}></div>
      </div>
    )
  }
}

 YoutubePlayer.propTypes = {
  tracklists: PropTypes.arrayOf(PropTypes.string),
  selectedTrack: PropTypes.number
}