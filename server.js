const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ===== جلب الأفاتار ===== */
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

    res.json({ image: ad.data[0].imageUrl });

  } catch {
    res.json({error:true});
  }
});

/* ===== حفظ الرسائل ===== */
app.post("/send-message", (req, res) => {
  try {
    const { message, username } = req.body;

    let data = [];
    if (fs.existsSync("messages.json")) {
      data = JSON.parse(fs.readFileSync("messages.json"));
    }

    data.push({
      user: username,
      text: message,
      time: Date.now()
    });

    fs.writeFileSync("messages.json", JSON.stringify(data, null, 2));

    res.json({ success: true });

  } catch {
    res.json({ success: false });
  }
});

/* ===== عرض الرسائل ===== */
app.get("/messages", (req, res) => {
  if (!fs.existsSync("messages.json")) return res.json([]);
  res.json(JSON.parse(fs.readFileSync("messages.json")));
});

/* ===== الصفحة الرئيسية ===== */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server running");
});
