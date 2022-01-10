import React from 'react';
import TrackList from '../TrackList /TrackList';
import './Playlist.css'


class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.handelChangeName=this.handelChangeName.bind(this);
    }
    handelChangeName(e){
        this.props.onChangeName(e.target.value)
    }
    
    render() {
        return(
    <div className="Playlist">
        <input type='text' defaultValue="" placeholder='Enter Name Music PlayList' onChange={this.handelChangeName} />
        <TrackList tracks={this.props.playlistTracks} 
                    onRemove={this.props.onRemove}
                    isRemoval={true} 
                    />
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
    </div>
        )
    }
}

export default Playlist;