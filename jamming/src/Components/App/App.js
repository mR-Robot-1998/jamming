import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../Playlist/Playlist'
import { Spotify } from '../../util/Spotify';
//  import TrackList from '../TrackList /TrackList';
class  App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        searchResults :[],
        playlist:'myPlaylist',
        playlistTracks:[]
    };
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this)
    this.savePlayList=this.savePlayList.bind(this);
    this.search=this.search.bind(this);
  }

   addTrack (track) {
      let tracks=this.state.playlistTracks

      if (tracks.find(gid => gid.id === track.id)){
        return
      }
      tracks.push(track)
      this.setState({playlistTracks:tracks})
    
  }
  removeTrack(track){
    let tracks=this.state.playlistTracks

    tracks=tracks.filter(nowTrack => nowTrack.id != track.id);

    this.setState({playlistTracks:tracks})

  }
  updatePlaylistName (name){

    this.setState({PlayList:name})
  }

    savePlayList(){
      // alert('Saved PlayList to Acc spotify ')
      const trackUris =this.state.playlistTracks.map(track => track.uri)
      Spotify.savePlayList(this.state.playlist,trackUris).then(() => {
        this.setState({
          playlist:'New list ',
          playlistTracks:[]
        })
      })
    }
    search(term){
        Spotify.search(term).then(searchResults => {
          this.setState({searchResults:searchResults})
        })
    }

  render() {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
          <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} 
                       onAdd={this.addTrack}
                       />
        <PlayList playlist ={this.state.playlist} 
                  playlistTracks={this.state.playlistTracks}
                  onRemove={this.removeTrack}
                  onChangeName={this.updatePlaylistName}
                  onSave={this.savePlayList}/>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
