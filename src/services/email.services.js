import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // must be verified in SendGrid
    subject: "Verify your account",
    text: `Your verification OTP is: ${otp}`,
    html: `
      <div>
        <h2>Account Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};
