const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// جلب الأفاتار من Roblox
app.post("/avatar", async (req, res) => {
  try {
    const username = req.body.username;

    const r = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({usernames:[username]})
    });

    const data = await r.json();

    if(!data.data || data.data.length === 0){
      return res.json({error:true});
    }

    const id = data.data[0].id;

    const a = await fetch(
      "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
      id + "&size=150x150&format=Png"
    );

    const ad = await a.json();

    res.json({
      success: true,
      image: ad.data[0].imageUrl
    });

  } catch (e) {
    console.log("❌ Avatar Error:", e);
    res.json({error:true});
  }
});

// إرسال الإيميل
app.post("/send-email", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("📩 رسالة:", message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lliansameh724@gmail.com",
        pass: "elzb uaav ugqb uafv" // 👈 ضع App Password هنا
      }
    });

    await transporter.sendMail({
      from: "lliansameh724@gmail.com",
      to: "lliansameh724@gmail.com",
      subject: "رسالة من الموقع",
      text: message
    });

    console.log("✅ تم إرسال الإيميل");
    res.json({ success: true });

  } catch (e) {
    console.log("❌ EMAIL ERROR:", e);
    res.json({ success: false });
  }
});

// تشغيل السيرفر
app.listen(process.env.PORT || 8080, () => {
  console.log("🚀 Server running");
});
