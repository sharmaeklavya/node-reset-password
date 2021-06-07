const randomString = require("random-string");
const nodemailer = require("nodemailer");
const verificationString = randomString({ length: 50 });

const password = process.env.emailPass;

const auth = async (emailaddress) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "errik41@gmail.com",
        pass: password,
      },
    });
    await transporter.sendMail({
      from: '"SpotPass 😊" <errik41@gmail.com>',
      to: emailaddress,
      subject: "Password Reset",
      html: `<div style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); border: 1px solid lightgray; border-radius: 5px; padding: 1rem; text-align:center;">
      <h1 style="font-size:0.5rem; color:salmon;">Dear User, If you have requested for a new password. Please verify this email to reset your password or simply ignore this email.</h1>
      <div style="padding: 1rem; margin: 0.75rem 0;">
        <img style="width:300px; height:350px;" src="https://images.unsplash.com/photo-1582161990632-b63fc933dd93?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" style="width:100%; height:100%;" alt="recover-password">
      </div>
      <a href="http://localhost:3000/${verificationString}" style="font-size: 1rem; padding:0.75rem; border:none; border-radius:5px; text-decoration:none; background-color: rgb(76, 175, 75); color: whitesmoke; cursor:pointer;">Reset Now</a>
    </div>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
