import fetch from "node-fetch";
import { senderIds } from "../constants/senderIds.js";
import { getCountryByMobileNumber } from "./getCountryByMobileNumber.js";

export const sendMessage = async ({ mobileNumber, message, instituteId }) => {
  //extract country from mobile number
  const country = 'LK';
  let sendSmsUrl = "";
  let sender = senderIds["DEFAULT"];
  const isInstituteBased = process.env.IS_SMS_INSTITUTE_BASED === "Yes";

  if (isInstituteBased) {
    //select specific sender id group
    sender = senderIds[instituteId];
  }
  if(sender === undefined){
    sender = senderIds["DEFAULT"];
  }


  switch (country) {
    case "BD": {
      sendSmsUrl = `${process.env.SMS_GATEWAY_BANGLADESH_BASE_URL}?api_key=${sender.BD.api_key}&msg=${message}&to=${mobileNumber}`;
      console.log(sendSmsUrl);
      break;
    }
    case "QA": {
      sendSmsUrl = `${process.env.SMS_GATEWAY_QATAR_BASE_URL}/SendSMS?api_id=${sender.QA.apiId}&api_password=${sender.QA.apiPassword}&sms_type=T&encoding=T&sender_id=${sender.QA.senderId}&phonenumber=${mobileNumber}&textmessage=${message}`;
      console.log(sendSmsUrl);
      break;
    }
    case "LK": {
      sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);
      break;
    }
    case "MY": {
        sendSmsUrl = `${process.env.SMS_GATEWAY_MALAYSIA_BASE_URL}?apiusername=${sender.MY.apiusername}&apipassword=${sender.MY.apiPassword}&mobileno=${mobileNumber}&senderid=${sender.MY.senderId}&languagetype=1&message=${sender.MY.brandName} : ${message}`;
        console.log(sendSmsUrl);
        break;
      }
    default: {
      sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.SL.username}&password=${sender.SL.password}&src=${sender.SL.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);
      break;
    }
  }

  if (sendSmsUrl !== "") {
    const response = await fetch(sendSmsUrl, {
      method: "GET",
    });
    const result = await response.text();
    console.log(result);
  }
};
