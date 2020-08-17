import React from 'react';
import './Track.css'

class Track extends React.Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.pauseTrack = this.pauseTrack.bind(this);
    this.playTrack = this.playTrack.bind(this);
  }

  addTrack(){
    this.props.onAdd(this.props.track);
  }

  removeTrack(){
    this.props.onRemove(this.props.track);
  }

  pauseTrack(){
    this.props.onPause(this.props.track);
  }

  playTrack(){
    this.props.onPlay(this.props.track);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return <button className="Track-action" onClick={this.removeTrack}>-</button>
    } else {
      return <button className="Track-action" onClick={this.addTrack}>+</button>
    }
  }
  
  player() {
    if (this.props.isPlaying) {
      return <button className="Track-action" onClick={this.pauseTrack}>=</button>
    } else {
      return <button className="Track-action" onClick={this.playTrack}>></button>
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.player()}
        {this.renderAction()}
       
      </div>
    )
  }
}

export default Track;