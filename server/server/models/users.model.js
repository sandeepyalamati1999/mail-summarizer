import Promise from "bluebird";
import crypto from "crypto";
import httpStatus from "http-status";
import mongoose from "mongoose";
import mongooseFloat from "mongoose-float";

import APIError from "../helpers/APIError";
const Schema = mongoose.Schema;

/**
 * Users Schema
 */
const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    provider: {
      type: String,
    },
    picture: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {timestamps: true }
);


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UsersSchema.methods = {
  /**
   * Create instance method for authenticating users
   * @param {password}
   */
  authenticate(password) {
    return this.password === this.hashPassword(password);
  },

  /**
   * Create instance method for hashing a password
   * @param {password}
   */
  hashPassword(password) {
    if (this.salt && password) {
      return crypto
        .pbkdf2Sync(
          password,
          Buffer.from(this.salt, "base64"),
          10000,
          64,
          "SHA1"
        )
        .toString("base64");
    } else {
      return password;
    }
  },
};

UsersSchema.statics = {
  /**
   * save and update Users
   * @param Users
   * @returns {Promise<Users, APIError>}
   */
  saveData(users) {
    return users.save().then((users) => {
      if (users) {
        return users;
      }
      const err = new APIError("error in users", httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @returns {Promise<users[]>}
   */
  list(query) {
    return this.find(query.filter, query.dbfields)
      // .populate("role")
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },

  /**
   * Count of users records
   * @returns {Promise<users[]>}
   */
  totalCount(query) {
    return this.find(query.filter).countDocuments();
  },
  /**
   * Get users
   * @param {ObjectId} id - The objectId of users.
   * @returns {Promise<users, APIError>}
   */
  get(id) {
    return this.findById(id)
    //  .populate("role")
      .exec()
      .then((users) => {
        if (users) {
          return users;
        }
        const err = new APIError("No such users exists", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Find unique email.
   * @param {string} email.
   * @returns {Promise<Users[]>}
   */
  findUniqueEmail(email) {
    email = email.toLowerCase();
    return this.findOne({
      email: email,
      active: true,
    })
      // .populate("role")
      .populate("listPreferences", "columnOrder")
      .exec()
      .then((users) => users);
  },
};

export default mongoose.model("Users", UsersSchema);
