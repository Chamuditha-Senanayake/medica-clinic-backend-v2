import nodemailer from "nodemailer";

export const sendEmail = ({ to, subject, html, attachments }) => {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve("Email sent");
      }
    });
  });
};

export const sendEmailFromCustomAccount = ({
  emailUser,
  emailPassword,
  to,
  subject,
  html,
  attachments,
}) => {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    let mailOptions = {
      from: emailUser,
      to: to,
      subject: subject,
      html: html,
      attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve("Email sent");
      }
    });
  });
};
