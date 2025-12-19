/**@Packages */
import { google } from "googleapis";
/**@Models */
import Users from "../models/users.model";
import AccessToken from "../models/accessTokens.model";
import Mail from "../models/mail.model";

/**@Services */
import gmailService from "../services/gmail.service";

/**@Globals */
const auth = new google.auth.OAuth2();

async function getEmails() {
    const users = await Users.find({ active: true});
    for(const user of users) {
        let token = await AccessToken.findOne({ active: true, email: user.email });
        const listMessagesResponse = await gmailService.getMailsList(token.accessToken);
        console.log("RES", listMessagesResponse)
        for(let message of listMessagesResponse.data.messages){
            let messageResult = await gmailService.getFullMessage(token.accessToken, message.id);
            if(!messageResult.error) {
                const newMail = new Mail(messageResult.data);
                const savedMail = await Mail.saveData(newMail);
                console.log("SAVED ID", savedMail._id);
            }
        }
    }
}

// getEmails();