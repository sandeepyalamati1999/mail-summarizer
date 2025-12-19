process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.SERVER_PORT = process.env.SERVER_PORT || "8676";
process.env.JWT_SECRET = "0a6b944d-d2fb-46fc-a85e-0295c986cd9f";
// process.env.MONGO_HOST = 'mongodb://127.0.0.1:27017/ticket'
process.env.MONGO_HOST = "mongodb://localhost:27017/ticketsupport"
// process.env.MONGO_HOST = 'mongodb://localhost:27017/krowd'
process.env.MONGO_PORT = "27017";
require("dotenv").config();
require("@babel/register");
require("@babel/polyfill");
require("./server");
