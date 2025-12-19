import Joi from "joi";

import emailConfig from "./extra/email.config";
import listPreferencesConfig from "./listPreferencesConfig";

let arr = ["development", "production", "test", "provision"];

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(...arr)
    .default("development"),
  SERVER_PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  JWT_SECRET: Joi.string().description("JWT Secret required to sign"),
  MONGO_HOST: Joi.string().description("Mongo DB host url"),
  MONGO_PORT: Joi.number().default(27017),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

let config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: "0a6b944d-d2fb-46fc-a85e-0295c986cd9f",
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    test: "mongodb://jayeesha:J%40yEe%24%23%40Sy%24tem%24%5Enc%402024@api.nocode3.dosystemsinc.com:27999/ticket?authSource=admin",
  },
  projectName: "ticket",
  commonRole: {
    user: "user",
    employee: "employee",
  },
  commonStatus: {
    Active: "Active",
    Inactive: "Inactive",
    Pending: "Pending",
    Disabled: "Disabled",
    Suspend: "Suspend",
  },
  emailTemplates: {
    forgetPassword: "forget password",
    registration: "registration",
    register: "register",
    adminForgetPassword: "admin forget password",
    employeeWelcome: "employee welcome",
    welcomeUser: "welcome user",
    authenticationUser: "authentication user",
    differentDeviceLoginConfirmation: "different device login confirmation",
    employeeCreate: "employeeCreate",
    ActivitiesCreate: "ActivitiesCreate",
    "Email TemplatesCreate": "Email TemplatesCreate",
    RolesCreate: "RolesCreate",
    "Upload HistoryCreate": "Upload HistoryCreate",
    "Email StatusCreate": "Email StatusCreate",
    TicketsCreate: "TicketsCreate",
    UsersCreate: "UsersCreate",
  },
  upload: {
    ...{
      EmployeesDuplicates: "server/upload/EmployeesDuplicates",
      employees: "server/upload/employees",
      employeesattachment: "server/upload/attachment/employees",
      TicketsDuplicates: "server/upload/TicketsDuplicates",
      tickets: "server/upload/tickets",
      ticketsattachment: "server/upload/attachment/tickets",
      UsersDuplicates: "server/upload/UsersDuplicates",
      users: "server/upload/users",
      usersattachment: "server/upload/attachment/users",
    },
    ...{
      user: "server/upload/user",
      employee: "server/upload/employee",
      currency: "server/upload/currency",
      country: "server/upload/country",
      csv: "server/upload/csv",
      attachment: "server/upload/attachment",
      bulkupload: "server/upload/bulkupload",
    },
  },
  // showOrHideFields: {}
  //  showOrHideFields: { user: [{ fieldName: name, employee: true, user: false }] }
  commonDevices: {
    ios: "ios",
    android: "android",
    web: "web",
  },
  limit: 50,
  page: 1,
  sortfield: "created",
  direction: "desc",
  isLoggerValidEnable: false,
  expireTokenTime: 51840000000,
  isTokenNotPassed: false,
  commonOTPAllowed: false,
  commonOTPNumber: 999999,
  viewsExtension: "server/views/",
  isAccessServer: false,
  awsRegion: "us-east-1",
  secret: "secret",
  adminRoomName: "adminRoomUser",
  encryptionStatus: "0", // options '1' for enable, '0' for disable
  fixNum: 8,
  nexmoapiKey: "8a0e4130",
  nexmoapiSecret: "leBt695jb9hrwIcF",
  smsOtpStatus: "enabled", // options 'enabled', 'disabled'
  clientIps: ["127.0.0.1", "167.99.10.87", "::ffff:127.0.0.1", "::1"], // for test purpose
  path: "/var/www/upload",
  serverUrl: "http://localhost:3000/",
  sourceKey: "qVtYv2x5A7CaFcHeMh",
  columnOrder: listPreferencesConfig,
  googleClient: process.env.GOOGLE_CLIENT_KEY,
  googleSecret: process.env.GOOGLE_SECRET,
  frontendUrl: process.env.FRONTENDURL
};

config = Object.assign(config, emailConfig);

export default config;
