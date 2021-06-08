const randomString = require("random-string");
const nodemailer = require("nodemailer");
const verificationString = randomString({ length: 50 });

const password = process.env.emailPass;

const auth = async (emailaddress) => {
  try {
    const transporter = nodemailer.createTransport({      
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {ciphers:'SSLv3'},
    auth: {
        user: "plzdonotrespond@outlook.com",
        pass: password,
      },
    });
    await transporter.sendMail({
      from: '"SpotPass 😊" <plzdonotrespond@outlook.com>',
      to: emailaddress,
      subject: "Password Reset",
      html: `<div style="margin : 0 auto; width: 450px; border:1px solid lightgray; border-radius:5px; padding:1rem; text-align:center;">
      <h1 style="font-size:0.95rem; color:salmon; text-align: left;"> <lead>Dear user,</lead> <br/> <br/>if you have requested for a new password. Please verify this email to reset the password or simply ignore this email.</h1>
      <div style="padding:1rem; margin:0.75rem auto; width:400px;">
        <img src="https://images.unsplash.com/photo-1590280986931-d675a2cf9b2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1047&q=80" style="width:100%; height:100%;" alt="recover-password">
      </div>
      <a href="http://localhost:3000/${verificationString}" style="font-size: 1rem; padding:0.75rem; border:none; border-radius:5px; text-decoration:none; background-color: rgb(76, 175, 75); color: whitesmoke; cursor:pointer;">Reset Now</a>
      </div>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
