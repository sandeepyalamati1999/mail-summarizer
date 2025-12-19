/**@Imports */
import googleOAuth from "../auth/google.oauth"
import { google } from "googleapis";

/**@Models */
import AccessToken from "../models/accessTokens.model";
import usersService from "../services/users.service";
import { token } from "morgan";
import config from "../config/config";

/**
 * 
 * @param { import('express').Request } req 
 * @param { import('express').Response } res 
 * @param { import('express').NextFunction } next 
 */
async function googleLoginWebhook(req, res, next) {
  const { code } = req.query;
  const { tokens } = await googleOAuth.getToken(code);

  googleOAuth.setCredentials(tokens);

  const oauth2 = google.oauth2({
      auth: googleOAuth,
      version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  await usersService.insertUserAndAccessToken(req, { ...data, ...tokens })

  res.cookie("session", tokens.access_token, { 
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.redirect(config.frontendUrl)

}

export default { googleLoginWebhook }