const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// API تجريبي فقط (لا يتعامل مع حسابات حقيقية)
app.post("/avatar", (req, res) => {
  const username = (req.body.username || "").trim();

  if (!username) {
    return res.json({ error: true });
  }

  // صورة افتراضية لأي اسم (للتجربة فقط)
  const img = "https://api.dicebear.com/7.x/avataaars/png?seed=" + encodeURIComponent(username);

  res.json({
    success: true,
    image: img
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server running");
});
