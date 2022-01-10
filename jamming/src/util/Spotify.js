
const clientId = "4451b5a3a3804ad9876c63df52902f14";
let accessToken = "";
const redirectURI = "http://localhost:3000/";

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },
  Search(term){
      const accessToken=Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
          headers:{
              Authorization:`Bearer ${accessToken}`
          }
      }).then(response => {
          return response.json()
      }).then(jsonResponse => {
          if(!jsonResponse.tracks){
              return [];
          }
          return jsonResponse.tracks.items.map(track => ({
              id:track.id,
              name:track.name,
              artist:track.artist[0].name,
              album:track.album.name,
              uri:track.uri
          }));
      });
  },
    savePlayList(name,trackUris){
        if(!name || !trackUris.length){
            return;
        }
        const accessToken= Spotify.getAccessToken();
        const headers ={Authorization:`Bearer ${accessToken}`}
        let userId;

        return fetch(`https://api.spotify.com/v1/me`,{headers:headers})
        .then(response => response.json() )
        .then(jsonResponse => {
            userId=jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers:headers,
                method:'POST',
                body:JSON.stringify({name:name})
            }).then(response => response.json())
            .then(jsonResponse => {
                const playlistId= jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/user/${userId}/playlists/${playlistId}/tracks`, {
                    headers:headers,
                    method:'POST',
                    body:JSON.stringify({uris:trackUris}),
                })
            })
        })
  }
}




//   search(searchTerm) {
//     let spotifyTracks = fetch(
//       `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     )
//       .then((response) => response.json())
//       .then((jsonResponse) => {
//         if (!jsonResponse) {
//           return [{}];
//         }

//         let tracks = jsonResponse.tracks.items.map((track) => ({
//           id: track.id,
//           name: track.name,
//           artist: track.artists[0].name,
//           album: track.album.name,
//           uri: track.uri,
//         }));

//         return tracks;
//       })
//       .catch((error) => {
//         console.log("Spotify search error");
//       });

//     return spotifyTracks;
//   },

//   async savePlaylist(playlistName, tracksUri) {
//     if (!(playlistName && tracksUri)) return;

//     // Get spotify user Id
//     let userId = await fetch("https://api.spotify.com/v1/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((jsonResponse) => jsonResponse.id)
//       .catch((error) => {
//         console.log("User id Fetch error");
//       });

//     // Create playlist
//     let playlistId = await fetch(
//       `https://api.spotify.com/v1/users/${userId}/playlists`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: playlistName,
//         }),
//         json: true,
//       }
//     )
//       .then((response) => response.json())
//       .then((jsonResponse) => jsonResponse.id)
//       .catch((error) => {
//         console.log("Create Playlist error");
//       });

//     await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         uris: tracksUri,
//       }),
//     })
//       .then((response) => {
//         console.log("Songs added to playlist");
//       })
//       .catch((error) => {
//         console.log("Fetch error while adding songs to the playlist");
//       });
//   },
// };