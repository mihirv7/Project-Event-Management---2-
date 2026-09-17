const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/sendEmail");

router.get("/test", async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.EMAIL_USER,

      subject: "Momento - Test Email",

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          
          <h2 style="color: #8b5e3c;">
            Momento Event Management
          </h2>

          <p>
            Hello,
          </p>

          <p>
            This is a test email from the Momento Event Management System.
          </p>

          <p>
            Your email configuration is working successfully.
          </p>

          <hr />

          <p style="color: #777;">
            Thank you for using Momento.
          </p>

        </div>
      `,
    });

    if (result) {
      return res.json({
        success: true,
        message: "Test email sent successfully",
      });
    }

    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

module.exports = router;