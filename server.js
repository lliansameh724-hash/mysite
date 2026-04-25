const express = require("express");
const path = require("path");
const cors = require("cors");

// node-fetch للنسخ الجديدة من Node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// تقديم ملفات الموقع
app.use(express.static(__dirname));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API لجلب صورة المستخدم
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
      "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + id + "&size=150x150&format=Png"
    );

    const ad = await a.json();

    res.json({
      success:true,
      image: ad.data[0].imageUrl
    });

  } catch {
    res.json({error:true});
  }
});

app.listen(3000, () => console.log("Server running"));