const commonUrl = 'http://localhost:8676/';
const config = {
  baseUrl: commonUrl + 'api/',
  imageUrl: commonUrl + 'images/',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export default config;
