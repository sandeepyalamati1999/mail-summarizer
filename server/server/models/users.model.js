import Promise from "bluebird";
import crypto from "crypto";
import httpStatus from "http-status";
import mongoose from "mongoose";
import mongooseFloat from "mongoose-float";

import APIError from "../helpers/APIError";

const Float = mongooseFloat.loadType(mongoose);
const Schema = mongoose.Schema;

const UsersSchemaJson = require("../schemas/users.json");

/**
 * Default Scheamas
 */
let defaultSchemaValues = {
  password: String,
  salt: String,
  forgotPasswordExpireTimeStamp: Number,
  photo: Array,
  email: String,
  base32Secrect: String,
  role: { type: String },
  // created: {
  //   type: Date
  // },
  // updated: {
  //   type: Date
  // },
  firstTimeLogin: {
    type: Boolean,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.ObjectId,
  },
  createdByName: String,
  updatedByName: String,
  listPreferences: {
    type: Schema.Types.ObjectId,
    ref: "ListPreferences",
  },
  isTwoFactorAuthentication: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date,
  isRemember: {
    type: Boolean,
    default: false,
  },
  isRememberLogin: Date,
  enableTwoFactAuth: {
    type: Boolean,
    default: true,
  },
  photoUrl: String,
  isGoogleUser: { type: Boolean },
};

/**
 * Users Schema
 */
const UsersSchema = new mongoose.Schema(
  {
    ...defaultSchemaValues,
    ...UsersSchemaJson,
  },
  { usePushEach: true }
);

/**
 * Hook a pre save method to hash the password
 */
UsersSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    this.salt = crypto.randomBytes(16).toString("base64");
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 *
 * @Function
 * @ForValidations (preValidatorSchema)
 *
 */
function preValidatorSchema(thisObj, next) {
  if (!thisObj) {
    const validationError = new APIError("failed to save user data.");
    validationError.name = "mongoFieldError";
    next(validationError);
  } else {
    /**@Remove the *(star) it will work */
    //*preRequired
    //*preValidator
  }
}

/**
 * Hook a pre validate method to users the local password
 */
UsersSchema.pre("validate", function (next) {
  if (
    this.provider === "local" &&
    this.password &&
    this.isModified("password")
  ) {
    let result = owasp.users(this.password);
    if (result.errors.length) {
      let error = result.errors.join(" ");
      this.invalidate("password", error);
    }
  }
  preValidatorSchema(this, next);

  next();
});

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
