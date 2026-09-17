const transporter = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Momento Event Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.log("Email sending error:", error);
    return false;
  }
};

module.exports = sendEmail;