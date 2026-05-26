import { createTransport } from "nodemailer";

// Create a transporter using SMTP
const transporter = createTransport({
  host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body,
        });
        console.log("Email sent:", info.response);
        return info.response;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export default sendEmail;