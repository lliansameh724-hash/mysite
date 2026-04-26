const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

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
      "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" 
      + id + "&size=150x150&format=Png"
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

app.listen(process.env.PORT || 8080, () => {
  console.log("Server running");
});