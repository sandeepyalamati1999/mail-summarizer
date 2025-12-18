import nodemailer from 'nodemailer';
import ses from 'node-ses';

import config from '../config/config';

import EmailVerify from '../models/emailVerification.model';
import EmailStatus from '../models/emailstatus.model';
import Template from '../models/templates.model';
import Setting from '../models/settings.model'

import SendGridService from './sendgrid.service';

import serviceUtil from '../utils/service.util';

const sendGridService = new SendGridService();

// initialize smtp taransport 
// let smtpTransport;
// if (config && config.mailSettings && config.mailSettings.mailType) {
//   if (config.mailSettings.mailType === 'ses') {
//     if (config.mailSettings.sesEmailSettings && config.mailSettings.sesEmailSettings.key && config.mailSettings.sesEmailSettings.secret) {
//       smtpTransport = ses.createClient({
//         key: config.mailSettings.sesEmailSettings.key,
//         secret: config.mailSettings.sesEmailSettings.secret
//       });
//     }
//   } else if (config.mailSettings.mailType === 'smtp') {
//     if (config.mailSettings.smtpOptions) {
//       smtpTransport = nodemailer.createTransport(config.mailSettings.smtpOptions);
//     }
//   } else if (config.mailSettings.mailType === 'gmail') {
//     if (config.mailSettings.gmailOptions) {
//       smtpTransport = nodemailer.createTransport(config.mailSettings.gmailOptions);
//     }
//   } else if (config.mailSettings.mailType === 'zoho') {
//     if (config.mailSettings.zohoEmailOptions) {
//       smtpTransport = nodemailer.createTransport(config.mailSettings.zohoEmailOptions);
//     }
//   }
// }

let smtpTransport
async function mail() {

  console.log("eneterdtdd")
  let settings1 = await Setting.findOne({ active: true }).lean();
  if (config && config.mailSettings && config.mailSettings.mailType && settings1 && settings1.nodeMailerHost) {
    if (config.mailSettings.mailType === 'ses') {
      if (config.mailSettings.sesEmailSettings && config.mailSettings.sesEmailSettings.key && config.mailSettings.sesEmailSettings.secret) {
        smtpTransport = ses.createClient({
          key: config.mailSettings.sesEmailSettings.key,
          secret: config.mailSettings.sesEmailSettings.secret
        });
      }
    } else if (config.mailSettings.mailType === 'smtp') {
      let mailObj = {
        "service": "Gmail",
        "requireTLS": false,
        "host": settings1.nodeMailerHost,
        "port": 587,
        "secure": false,
        "ignoreTLS": true,
        "auth": {
          "user": settings1.nodeMailerUser,
          "pass": settings1.nodeMailerPass
        }
      }

      smtpTransport = nodemailer.createTransport(mailObj);
      console.log("smtp optuonssss", smtpTransport)

    } else if (config.mailSettings.mailType === 'gmail') {
      if (config.mailSettings.gmailOptions) {
        smtpTransport = nodemailer.createTransport(config.mailSettings.gmailOptions);

      }
    } else if (config.mailSettings.mailType === 'zoho') {
      if (config.mailSettings.zohoEmailOptions) {
        smtpTransport = nodemailer.createTransport(config.mailSettings.zohoEmailOptions);
      }
    }
  }
}
mail()

class EmailService {
  constructor() {

  }
  /**
   * modify template text to html
   * @param template
   * @param emailParams
   */
  modifyTemplateTextToHtml(template, emailParams) {
    var templateFnDesc = serviceUtil.camelize(template.name);
    let templateFns = {
      forgetPassword: () => {
        return template.templateText
          .replace(/###USERNAME###!/g, emailParams.userName)
          .replace(/###LINK###/g, emailParams.link)
      },
      adminForgetPassword: () => {
        return template.templateText
          .replace(/###DISPLAYNAME###!/g, emailParams.displayName)
          .replace(/###LINK###/g, emailParams.link)
      },
      welcomeUser: () => {
        return template.templateText
          .replace(/###USERNAME###!/g, emailParams.userName)
          .replace(/###EMAIL/g, emailParams.email)
          .replace(/###LINK###/g, emailParams.link)
      },
      employeeWelcome: () => {
        return template.templateText
          .replace(/###DISPLAYNAME###!/g, emailParams.displayName)
          .replace(/###ID###/g, emailParams.Id)
          .replace(/###LINK###/g, emailParams.link)
      },
      authenticationUser: () => {
        return template.templateText
          .replace(/###USERNAME###!/g, emailParams.userName)
          .replace(/###OTP###/g, emailParams.otp)
      },
      differentDeviceLoginConfirmation: () => {
        return template.templateText
          .replace(/###USERNAME###/g, emailParams.displayName)
          .replace(/###OTP###/g, emailParams.OTP)
          .replace(/###OSNAME###/g, emailParams.osName)
          .replace(/###BROWSERTYPE###/g, emailParams.browserType)
      },
      sendOTP: () => {
        return template.templateText
          .replace(/###OTP###/g,emailParams.OTP)
          .replace(/###USERNAME###/g,emailParams.displayName)
      }
    };

    return {
      init: () => {
        return templateFns[templateFnDesc]();
      }
    };
  }

  /**
     * set email options from settngs
     * @param smtpTransport
     */
  getSmtpTransport() {
    // initialize smtp taransport 
    let smtpTransport = async function () {
      let settings = await Setting.findOne({ active: true });
      if (settings && settings.mailType) {
        if (settings.mailType === 'ses') {
          if (settings.sesEmailSettings && settings.sesEmailSettings.key && settings.sesEmailSettings.secret) {
            smtpTransport = ses.createClient({
              key: settings.sesEmailSettings.key,
              secret: settings.sesEmailSettings.secret
            });
          }
        } else if (settings.mailType === 'zoho') {
          if (settings.zohoEmailOptions) {
            smtpTransport = nodemailer.createTransport(settings.zohoEmailOptions);
          }
        } else {
          if (settings.smtpOptions) {
            smtpTransport = nodemailer.createTransport({
              "service": settings.nodeMailerService,
              "requireTLS": false,
              "host": settings.nodeMailerHost,
              "port": settings.nodeMailerPort,
              "secure": false,
              "ignoreTLS": true,
              "auth": {
                "user": settings.nodeMailerEmail,
                "pass": settings.nodeMailerPassword
              }
            });
          }
        }
      };
    };
    return {
      init: () => {
        return smtpTransport;
      }
    };
  }

  /**
   * send Email via grid
   * @param req
   */
  // async sendEmailviaGrid(req) {
  //   let template = await Template.findUniqueTemplate(req.templateName);
  //   if (template) {
  //     let params = {
  //       to: req.emailParams.to,
  //       subject: template.subject,
  //       html: template.templateText
  //     };
  //     // params.html = this.modifyTemplateTextToHtml(template, req.emailParams).init();

  //     sendGridService.send({ params });
  //   }
  // }

  // async sendEmailviaGrid(req) {
  //   let settings = await Setting.findOne({ active: true });
  //   let template = await Template.findUniqueTemplate(req.templateName);
  //   if (template) {
  //     let params = {
  //       to: req.emailParams.to,
  //       subject: template.subject,
  //       html: template.templateText
  //     };
  //     // params.html = this.modifyTemplateTextToHtml(template, req.emailParams).init();
  //     if (settings && settings.enableMails) {
  //       if (settings.emailSourceType === 'nodeMailer' && settings.sendGridEmail) {
  //         params.form = settings.sendGridEmail;
  //         this.getSmtpTransport().init().sendMail(params, function (err) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log('Email sent successfully.');
  //           }
  //         });
  //       } else {
  //         sendGridService.send({ params });
  //       }
  //     } else {
  //       console.log("Emails disabaled");
  //     }
  //   }
  // }

  async sendEmailviaGrid(req) {
    let settings = await Setting.findOne({ active: true });
    let template = req.templateName ? await Template.findUniqueTemplate(req.templateName) : req.template;
    if (template) {
      let params = {
        to: req.emailParams.to,
        subject: template.subject,
        // html: template.name != "admin forget password" ? template.templateText : this.modifyTemplateTextToHtml(template, req.emailParams).init()
        html: this.modifyTemplateTextToHtml(template,req.emailParams).init()
      };
      // params.html = this.modifyTemplateTextToHtml(template, req.emailParams).init();
      let emailStatus = new EmailStatus(params);
      emailStatus.templateName = template.name;
      emailStatus.templateId = template._id;
      emailStatus.entityType = req.entityType;
      if (settings && settings.enableMails) {
        if (settings.emailSourceType === 'nodeMailer' && settings.sendGridEmail) {
          params.from = settings.sendGridEmail;
          emailStatus.from = params.from
          return new Promise((resolve, reject) => {
            smtpTransport.sendMail(params, async function (err) {
              if (err) {
                emailStatus.status = "Failed"
                emailStatus.reason = "ERROR"
                await EmailStatus.saveDetails(emailStatus)
                console.log(err);
                reject(err)
              } else {
                emailStatus.status = "Sent"
                await EmailStatus.saveDetails(emailStatus)
                console.log('Email sent successfully.');
                resolve({ sucess: "OK" })
              }
            });
          })
        }
        else {
          sendGridService.send({ params, emailStatus });
        }
      } else {
        emailStatus.status = "Failed"
        emailStatus.reason = "Emails disabaled"
        await EmailStatus.saveDetails(emailStatus)
        console.log("Emails disabaled");
      }
    }
  }
  /**
* Create a record for email vrefiy for user
*/
  async createEmailVerfiyRecord(req, { type, login }) {
    let emailVerify = new EmailVerify();
    let expireTime = 60;
    let settings = await Setting.findOne({ active: true });
    if (type === 'userActive') {
      expireTime = settings.activeEmailExpireInMin || 10
    } else if (type === 'forgotPassword') {
      expireTime = settings.forgotEmailExpireInMin || 5
    }

    emailVerify.token = req.token;
    emailVerify.type = type;
    emailVerify.email = req.email;
    emailVerify.login = login;
    emailVerify.createdTimeStamp = (new Date()).getTime();
    emailVerify.expireTimeStamp = emailVerify.createdTimeStamp + (expireTime * 60 * 1000);
    await EmailVerify.saveData(emailVerify);
  }

}

export default EmailService;
