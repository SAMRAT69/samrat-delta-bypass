const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/delta/bypass", async (req, res) => {
  const { link } = req.query;
  if (!link) {
    return res.status(400).json({ warning: "Url Needed" });
  }
  const StartTime = Date.now();
  try {
    let result;
    if (link.startsWith("https://gateway.platoboost.com/a/8?id=")) {
      try {
        const DeltaAuthResponse = await axios.get(
          `http://fi1.bot-hosting.net:6780/api/bypass?link=${encodeURIComponent(link)}`
        );
        if (DeltaAuthResponse.data.Result) {
          result = DeltaAuthResponse.data.Result;
          console.log("Success:", key);
        } else {
          return res.status(500).json({
            error: "Failed to bypass url",
          });
        }
      } catch (error) {
        console.error("Failed to bypass url", error.message);
        return res.status(500).json({
          error: "Error fetching delta url",
        });
      }
    } else {
      return res.status(400).json({
        Note: "Url not supported to bypass Only Delta https://gateway.platoboost.com/a/8?id= like this",
        Message: "Samrat API",
      });
    }

    const EndTime = Date.now();
    const duration = ((EndTime - StartTime) / 1000).toFixed(2);
    res.json({
      key: result,
      duration: `${duration}s`,
      credit: "Made by Samrat API",
    });
  } catch (error) {
    console.error("Error:", error.message);
    const EndTime = Date.now();
    const duration = ((EndTime - StartTime) / 1000).toFixed(2);
    res.status(500).json({
      Error: "Failed to bypass",
      Details: error.message,
      Duration: `${duration}s`,
      Message: "Made by Samrat API",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
