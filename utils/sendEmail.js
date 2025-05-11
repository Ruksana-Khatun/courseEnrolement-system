import nodemailer from "nodemailer";


const sendEmail = async ({ email, subject, message }) => {
  console.log("Sending to:", email);
  console.log("Subject:", subject);
  console.log("Message:", message);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    // port: Number(process.env.SMTP_PORT),
    secure:false, // for port 465
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject,
    html: message,
  });
};

export default sendEmail;