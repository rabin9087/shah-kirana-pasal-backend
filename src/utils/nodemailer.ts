import nodemailer from "nodemailer";

export async function sendEmail(email: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const options = {
    from: process.env.GMAIL_USER,

    to: email,
    subject: "The subject of the email",
    text: "The body of the email",
  };

  const info = await transporter.sendMail(options);
}

export async function sendRegisterationLink(userEmail: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const options = {
    from: process.env.GMAIL_USER,

    to: userEmail,
    subject: "Registeration Email",
    text: `Please click the link below to create a new account.
    </br>
    <a href='http://localhost:5173/sign-up?token=${token}'>link</a>    
    `,
  };

  const info = await transporter.sendMail(options);
  return info.messageId;
}
