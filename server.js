const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

require("dotenv").config();
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

app.post("/api/send-email", async (req, res) => {
    const { name, email, subject, message, company, website } = req.body;

    if (!name || !email || !subject || !message) {
        return res
            .status(400)
            .json({ error: "Bad request. All fields are required." });
    }

    const mailOptions = {
        from: email,
        to: "milanjulinac996@gmail.com",
        subject: `New Contact Message: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nCompany: ${company}\nWebsite: ${website}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        return res
            .status(500)
            .json({ error: "Internal server error. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
