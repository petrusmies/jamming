let accessToken;
const clientID = '88fc3c39e32541d88fb2abab2c7851b6';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }

    // Make sure the acces token is present
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if(accessToken && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location(accessUrl);
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();

    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    { headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    })
    .then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    });
  },

  savePlaylist(title, tracks) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer: ${accessToken}`};
    let userID;

    if(!title || tracks.length) {
      return;
    }

    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: title})
      })
      .then(response => response.json)
      .then(jsonResponse => {
        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({uris: tracks})
        })
      })
    })
  }
}

export default Spotify;
