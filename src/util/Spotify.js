let accessToken;
const my_client_id='d25d93a529264c409ca2b9737310e8ea';
const redirect_uri='http://localhost:3000';


const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } 

    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    const scopes = 'playlist-modify-public user-modify-playback-state'
    if (accessTokenMatch && expiresInMatch){
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1])
      //This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = ('https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri))
    }
  }, 

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } 
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    )
  },

  savePlaylist(name, trackArray) {
    if (!name || !trackArray.length) {
      return 
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userID;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
      { 
        headers: headers,
        method: 'POST', 
        body: JSON.stringify({ name: name })
      })
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      const playlist_id = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackArray})
      }
    )})
  },
  /*
  async pauseTrack() {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};

    try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, { headers: headers }
    ).then(response => {
      
    })
  }
  */
}



export default Spotify;