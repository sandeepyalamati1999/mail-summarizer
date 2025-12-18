import OtpVerfication from '../models/otpVerification.model';
import twilio, { Twilio } from "twilio";
import Nexmo from "nexmo";
import { TaskQueueRealTimeStatisticsContextImpl } from "twilio/lib/rest/taskrouter/v1/workspace/taskQueue/taskQueueRealTimeStatistics";

const region = "ap1";
const baseUrl = `https://api.${region}.twilio.com`;

async function sendSMS({smsProvider,...otpObj}) {
	if(smsProvider && smsProvider === "twilio"){
		return await twilioSmsService(otpObj);
	}
	else{
		return await nexmoSmsService(otpObj);
	}
};


async function createOtpVerification(otpModelObj){
	let createOtpVerfication = new OtpVerfication(otpModelObj);
	await OtpVerfication.saveData(createOtpVerfication);
}

async function nexmoSmsService({to,message}){
	return new Promise((resolve, reject) => {
		nexmo.message.sendSms(
			"+919849467662",        // place your nexmo phone number here.
			`+91${to}`,          //phone number you want to send.
			 message,     //write the message you want to send.
			(err, result) => {
				if (err) {
					console.log("ERR",err)
					reject(err);
				} else {
					console.log("Message sent successfully.");
					console.log(result)
					if (result.messages[0]['status'] === "0") {
						resolve({
							success: 'OK'
						});
					}
				}
		})
	})
}

async function twilioSmsService({from,to,message}){
    return new Promise((resolve,reject) => {
        twilioClient.messages.create({
            body:message,
            from:"+919849467662",
            to:`+91${to}`
        },(err,result)=>{
            if(err){
                console.log("ERR",err);
                reject({
                    failed:true
                })
            }
            else{
                resolve({
                    success:true
                })
                console.log("Sms sent successfully")
                return true;
            }
        })
    })
}


export default {
	sendSMS,
	createOtpVerification
}