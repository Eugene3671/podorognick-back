import express from 'express';

const app = express();
const PORT = 3001;


app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:3000"; 
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.get("/api/stories", async (req, res) => {
  try {
    const { page, perPage, sort } = req.query;

    const response = await fetch(
      `http://localhost:5001/api/stories?page=${page}&perPage=${perPage}&sort=${sort}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const data = await response.json();

    

    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));