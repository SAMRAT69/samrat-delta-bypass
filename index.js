const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/delta/bypass", async (req, res) => {
  const { link } = req.query; 

  if (!link) {
    return res.status(400).json({ error: "No link provided" });
  }

  console.log("Received link:", link); // Log the received link

  const StartTime = Date.now();
  try {
    let result;
    // Check if the link starts with the specified URL format
    if (link.startsWith("https://gateway.platoboost.com/a/8?id=")) {
      const idMatch = link.match(/id=([^&]+)/);
      const id = idMatch ? idMatch[1] : null;

      if (id) {
        try {
          console.log("Extracted ID:", id); // Log the extracted ID
          // Make the API call using the extracted ID
          const DeltaAuthResponse = await axios.get(
            `https://api-gateway.platoboost.com/v1/authenticators/8/${id}`
          );

          console.log("API response:", DeltaAuthResponse.data); // Log the API response

          if (DeltaAuthResponse.data.key) {
            result = DeltaAuthResponse.data.key; // Get only the key
            const EndTime = Date.now();
            const duration = ((EndTime - StartTime) / 1000).toFixed(2);
            return res.json({
              key: result, // Return only the key
              Duration: `${duration}s`,
              credit: "Made by Samrat API",
            });
          } else {
            return res.status(500).json({
              error: "No key found in response",
            });
          }
        } catch (error) {
          // Log the specific error response from the API
          console.error("Failed to bypass url:", error.response ? error.response.data : error.message);
          return res.status(500).json({
            error: "Failed to bypass",
          });
        }
      } else {
        return res.status(400).json({
          error: "Invalid ID in link",
        });
      }
    } else {
      return res.status(400).json({
        error: "Invalid link format. Must start with https://gateway.platoboost.com/a/8?id=",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return res.status(500).json({
      error: "Unexpected error occurred",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
