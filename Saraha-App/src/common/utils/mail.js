import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "omarghazala43@gmail.com",
      pass: "riid pznp xcaf sebk",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "omarghazala43@gmail.com",
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
