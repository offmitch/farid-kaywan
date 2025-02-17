const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); 

app.use(express.static(__dirname));
// app.use(bodyParser());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Email route
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received contact form data:", req.body);


    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "noreplykaywan@gmail.com",
            pass: "lstu pjgh thyf utwr"
        }
    });

    const mailOptions = {
        from: email,
        to: "farid.kaywan@kaywanlending.com",
        subject: `Hey Farid it's ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
