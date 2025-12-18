import 'babel-polyfill';
import request from 'supertest-as-promised';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';

import auth from '../../http-requests/lib/authorization';
import mochaAsync from '../../lib/mocha-async';

// load credentials
import credentials from '../../data/credentials.json';
import responseCodes from '../../data/response-codes.json';

import i18nUtil from '../../../utils/i18n.util';

// load payload module
import payload from '../../http-requests/lib/payloads/';
import Users from '../../models/users';
import Employee from '../../models/employee';
const authEmployee = new Employee(credentials.validEmployee);
const users = new Users();
const createpostBody = payload.getPostBody(users);

import usersModel from '../../../models/users.model';

import {getErrorResponseByKey,getErroResponseByErrorMessage} from '../../common.reponse'
import {generateMatchingString,generateMinLengthString,generateMaxLengthString,generateRandomNumberString,generateRandomAlphabets} from '../../string.generator'

// inject promise to mocha
chai.config.includeStack = true;
chai.use(chaiAsPromised);describe("## Check users creation", () => {
  beforeEach(
    mochaAsync(async () => {
      // login users and get access token
      await auth.getAccessToken(authEmployee);
    })
  );

  it("## Check users creation", (done) => {
    request(app)
      .post("/api/users")
      .send({ ...createpostBody })
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "usersCreate";
        expect(res.body).to.have.property("usersId");
        expect(res.body.respCode).to.equal(responseCodes.create);
        users.setId(res.body.usersId);
        done();
      })
      .catch(done);
  });

  it("## Check Passing Wrong ParamsId", (done) => {
    request(app)
      .put(`/api/users/${generateRandomNumberString()}`)
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .send({ ...createpostBody })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "usersUpdate";
        expect(res.body).to.deep.equal(getErrorResponseByKey("idNotFound"));
        done();
      })
      .catch(done);
  });

  it("## Should return users updated succesfully", (done) => {
    request(app)
      .put(`/api/users/${users.getId()}`)
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .send({ ...createpostBody })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "usersUpdate";
        expect(res.body).to.have.property("respCode");
        expect(res.body).to.have.property("usersId");
        expect(res.body.respCode).to.equal(responseCodes.update);
        done();
      })
      .catch(done);
  });
});
describe("## TEST WITHOUT PASSING TOKEN", () => {
  beforeEach(
    mochaAsync(async () => {
      // login users and get access token
      await auth.getAccessToken(authEmployee);
    })
  );

  it("WITHOUT TOKEN PASSED", (done) => {
    request(app)
      .put(`/api/users/${users.getId()}`)
      .send(createpostBody)
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "usersCreate";
        expect(res.body).to.deep.equal(
          getErrorResponseByKey("noPermissionErr")
        );
        done();
      })
      .catch(done);
  });
});
describe("## TEST REQUIRED FIELDS ", () => {
  beforeEach(
    mochaAsync(async () => {
      // login testLowerCase and get access token
      await auth.getAccessToken(authEmployee);
    })
  );

  it("CHECK password IS REQUIRED", (done) => {
    request(app)
      .put(`/api/users/${users.getId()}`)
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .send({ ...createpostBody, password: undefined })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "usersCreate";
        expect(res.body).to.deep.equal(
          getErroResponseByErrorMessage("password is required")
        );
        done();
      })
      .catch(done);
  });
});
