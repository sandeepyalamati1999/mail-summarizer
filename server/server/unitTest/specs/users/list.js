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

      let totalusers = await usersModel.find({ active: true });
      users.setId(totalusers.length);
    })
  );

  it("## Should return the list of the users", (done) => {
    request(app)
      .get("/api/users")
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property("users");
        expect(res.body.users).to.be.an("array");
        expect(res.body.users).to.not.have.length(0);
        done();
      })
      .catch(done);
  });

  it("## CHECK TOTAL RECORDS INCASE IF EXPORTTOCSV", (done) => {
    request(app)
      .get("/api/users?type=exportToCsv")
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property("users");
        expect(res.body.users).to.be.an("array");
        expect(res.body.users).to.not.have.length(0);
        if (users.getId() > 200) expect(res.body.users.length).to.equal(200);
        else expect(res.body.users.length).to.equal(users.getId());
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
      .get("/api/users")

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
