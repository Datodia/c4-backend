const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `Sender Name <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

const sendWelcomeMessage = async ({ to, subject }) => {
  const mailOptions = {
    from: `Sender Name <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:#ffffff;">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;background:linear-gradient(135deg,#0f172a,#312e81,#7c3aed);">
    <div style="width:100%;max-width:920px;border:1px solid rgba(255,255,255,.18);border-radius:28px;background:rgba(255,255,255,.1);box-shadow:0 30px 90px rgba(0,0,0,.35);backdrop-filter:blur(18px);overflow:hidden;">
      
      <div style="padding:56px 48px;text-align:center;">
        <div style="display:inline-block;padding:10px 16px;margin-bottom:24px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);font-size:14px;letter-spacing:.4px;">
          ✨ Welcome to the future
        </div>

        <h1 style="margin:0 0 18px;font-size:56px;line-height:1.05;font-weight:800;letter-spacing:-2px;">
          Build something<br />
          <span style="color:#c4b5fd;">beautiful today</span>
        </h1>

        <p style="max-width:620px;margin:0 auto 34px;font-size:18px;line-height:30px;color:#e5e7eb;">
          A clean, fancy welcome page with modern glass style, soft shadows,
          smooth spacing, and a strong call to action.
        </p>

        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <a href="#"
             style="display:inline-block;padding:15px 24px;border-radius:14px;background:#ffffff;color:#111827;text-decoration:none;font-weight:700;box-shadow:0 12px 30px rgba(255,255,255,.18);">
            Get Started
          </a>

          <a href="#"
             style="display:inline-block;padding:15px 24px;border-radius:14px;background:rgba(255,255,255,.12);color:#ffffff;text-decoration:none;font-weight:700;border:1px solid rgba(255,255,255,.25);">
            Learn More
          </a>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.14);">
        <div style="padding:24px;background:rgba(15,23,42,.45);">
          <div style="font-size:26px;margin-bottom:10px;">🚀</div>
          <h3 style="margin:0 0 8px;font-size:18px;">Fast</h3>
          <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:22px;">Simple layout, quick load, clean HTML.</p>
        </div>

        <div style="padding:24px;background:rgba(15,23,42,.45);">
          <div style="font-size:26px;margin-bottom:10px;">🎨</div>
          <h3 style="margin:0 0 8px;font-size:18px;">Modern</h3>
          <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:22px;">Glass card, gradient bg, soft radius.</p>
        </div>

        <div style="padding:24px;background:rgba(15,23,42,.45);">
          <div style="font-size:26px;margin-bottom:10px;">⚡</div>
          <h3 style="margin:0 0 8px;font-size:18px;">Ready</h3>
          <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:22px;">Paste and use in any HTML page.</p>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

const sendOtpCode = async ({ to, otp }) => {
  const mailOptions = {
    from: `Sender Name <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your verification code",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your account</title>
</head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:#ffffff;">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;background:linear-gradient(135deg,#0f172a,#312e81,#7c3aed);">
    <div style="width:100%;max-width:520px;border:1px solid rgba(255,255,255,.18);border-radius:24px;background:rgba(255,255,255,.1);box-shadow:0 30px 90px rgba(0,0,0,.35);padding:48px;text-align:center;">
      <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;">Verify your account</h1>
      <p style="margin:0 0 28px;font-size:16px;color:#e5e7eb;">Enter this code to finish signing up. It expires in 3 minutes.</p>
      <div style="display:inline-block;padding:18px 32px;border-radius:16px;background:#ffffff;color:#111827;font-size:40px;font-weight:800;letter-spacing:10px;">
        ${otp}
      </div>
      <p style="margin:28px 0 0;font-size:13px;color:#cbd5e1;">If you did not request this, ignore this email.</p>
    </div>
  </div>
</body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
};

module.exports = {sendEmail, sendWelcomeMessage, sendOtpCode};
