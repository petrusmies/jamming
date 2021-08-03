let accessToken;
const clientID = '';
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
      expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      window.location(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
      return accessToken;
    }
  }
}

export default Spotify;
