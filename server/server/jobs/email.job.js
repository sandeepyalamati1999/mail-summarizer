import nodeCron from "node-cron";
import fetchEmails from "../services/gmail.service";

nodeCron.schedule("* * * * *", () => {
    console.log("Running Cron Job");
    // imap.connect();
    // fetchEmails();
    // require("../services/gmail.service").default
})