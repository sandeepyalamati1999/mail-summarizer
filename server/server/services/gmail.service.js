const Imap = require('imap');
const { simpleParser } = require('mailparser');
import Email from "../models/email.model"; // Ensure Email model has appropriate methods
import ticketsService from "./tickets.service";

// Create IMAP connection
const imap = new Imap({
    user: "vamsitrails@gmail.com", // Replace with actual email or use env variables
    password: "fehw msyv tzuy apru", // Replace with actual password or use env variables
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false,
    },
});

// Function to open inbox in read/write mode
const openInbox = (cb) => {
    imap.openBox('INBOX', false, cb); // Set the readOnly parameter to false
};

// Function to fetch emails from inbox
const fetchEmails = () => {
    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;

            // Search for unread messages
            imap.search(['UNSEEN'], (err, results) => {
                if (err || results.length === 0) {
                    console.log('No new emails found.');
                    return;
                }

                const fetch = imap.fetch(results, { bodies: '', markSeen: false });

                fetch.on('message', (msg, seqno) => {
                    msg.on('body', (stream) => {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) {
                                console.error('Error parsing email:', err);
                                return;
                            }

                            const { from, to, subject, replyTo, text, html, date } = parsed;

                            // Handle HTML or plain text body
                            const emailBody = html || text;

                            // Create an object to store the email data
                            const emailData = {
                                from: from.text,
                                to: to.text,
                                subject: subject || 'No Subject',
                                replyTo: replyTo ? replyTo.text : null,
                                body: emailBody || 'No Content',
                                receivedDate: date,
                            };

                            // Check for duplicates
                            const existingEmail = await Email.findOne({
                                subject: emailData.subject,
                                receivedDate: emailData.receivedDate,
                            });

                            if (existingEmail) {
                                console.log('Duplicate email found, skipping...');
                                // Mark the email as read to avoid fetching again
                                imap.addFlags(seqno, '\\Seen', (err) => {
                                    if (err) {
                                        console.error('Error marking email as seen:', err);
                                    } else {
                                        console.log('Email marked as seen');
                                    }
                                });
                                return; // Skip processing this email
                            }

                            // Save to database
                            try {
                                const emailRecord = new Email(emailData);
                                const savedResult = await Email.saveData(emailRecord);
                                await ticketsService.createNewTicketFromEmail(savedResult);
                                console.log('Email saved to database');

                                // Mark the message as read (seen) in the IMAP server
                                imap.addFlags(seqno, '\\Seen', (err) => {
                                    if (err) {
                                        console.error('Error marking email as seen:', err);
                                    } else {
                                        console.log('Email marked as seen');
                                    }
                                });
                            } catch (error) {
                                console.error('Error saving email to database:', error);
                            }
                        });
                    });
                });

                fetch.once('end', () => {
                    console.log('Done fetching emails.');
                    imap.end(); // Close the IMAP connection
                });
            });
        });
    });

    // Handle connection errors
    imap.once('error', (err) => {
        console.error('IMAP Connection Error:', err);
    });

    imap.end("ready", () => console.log("PROCESS ENDED ========>"))

    // Start IMAP connection
    imap.connect();
};

// Export the fetchEmails function
export default fetchEmails;
