import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import APIError from '../helpers/APIError';

/**
 * Post Schema
 */
const AccessTokenSchema = new mongoose.Schema({
  accessToken: { 
    type: String,
  },
  refreshToken: {
    type: String,
  },
  scope: {
    type: String,
  },
  idToken: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
  refreshTokenExpiryDate: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  picture: {
    type: String
  },
  google: {
    accessToken: String,
    refreshToken: String,
    expiryDate: Date,
    refreshTokenExpiryDate: Number,
    idToken: String,

  }

}, { usePushEach: true, timestamps: true });

/**
 * Statics
 */
AccessTokenSchema.statics = {

  /**
   * save and update token
   * @param token
   * @returns {Promise<Token, APIError>}
   */
  saveData(token) {
    return token.save()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Error in user', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Find unique token.
   * @param {objectId} userId.
   * @returns {Promise<Token>}
   */
  findUniqueToken(email, loginType) {
    return this.findOne({
      email: email,
      loginType: loginType
    })
      .exec()
      .then((token) => token);
  }
};

/**
 * @typedef Token
 */
export default mongoose.model('accessTokens', AccessTokenSchema);