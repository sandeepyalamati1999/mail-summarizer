/**@Packages */
import { google } from "googleapis";
import { gmail } from "googleapis/build/src/apis/gmail";

/**@Globals */
const auth = new google.auth.OAuth2();

async function getMailsList(accessToken) {
    try {
        if(!accessToken) return { error: true, messsage: "provide accessToken."}
        auth.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({ version: "v1", auth });
        const listMessages = await gmail.users.messages.list({
            userId: "me",
            q: "is:unread",
            maxResults: 500
        });
        if(listMessages.ok) return { error: false, data: listMessages.data };
        else return { error: true, message: "failed to fetch emails."}
    }
    catch(err) {
        return { error: true, message: err.message }
    }
}

async function getFullMessage(accessToken, id) {
    try {
        if(!accessToken || !id ) return { error: true, message: "please provide access token and id"}
        auth.setCredentials({ access_token: accessToken });
        const gmail = await google.gmail({ version: "v1", auth})
        const response = await gmail.users.messages.get({ 
            userId: "me",
            id,
            format: "full"
        });

        const message = response.data;
        const headers = message.payload.headers || [];

        const emailObject = {
        provider: "gmail",
        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        cc: getHeader(headers, "Cc")
            ? getHeader(headers, "Cc").split(",").map(v => v.trim())
            : [],
        bcc: getHeader(headers, "Bcc")
            ? getHeader(headers, "Bcc").split(",").map(v => v.trim())
            : [],

        replyTo: getHeader(headers, "Reply-To"),
        subject: getHeader(headers, "Subject"),

        body: extractBody(message.payload),

        labels: message.labelIds || [],
        mimeType: message.payload.mimeType,
        snippet: message.snippet,

        providerMessageId: message.id,
        threadId: message.threadId,
        receivedAt: new Date(Number(message.internalDate)),
        };

        return { error: false, data: emailObject };


    }catch(err) {
        return { error: true, message: err.message, details: err.response?.data?.error || null }
    }
}

/**@PrivateFunctions */
function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "";
}

function extractBody(payload) {
  if (!payload) return "";

  // Single-part message
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  // Multi-part message
  if (payload.parts) {
    for (const part of payload.parts) {
      if (
        part.mimeType === "text/html" ||
        part.mimeType === "text/plain"
      ) {
        if (part.body?.data) {
          return Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }

      // Recursive for nested parts
      if (part.parts) {
        const body = extractBody(part);
        if (body) return body;
      }
    }
  }

  return "";
}

export default { getMailsList, getFullMessage }