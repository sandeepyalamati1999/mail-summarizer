import { google } from "googleapis";
import config from "../config/config";


const googleOAuth = new google.auth.OAuth2({ 
  clientId: config.googleClient,
  clientSecret: config.googleSecret,
  redirect_uris: [
    // "http://localhost:5678/rest/oauth2-credential/callback",
    "http://localhost:8676/api/auth/google/webhook",
    "http://localhost:5173"
  ]
});

console.log("CONFIG", config);


export default googleOAuth;