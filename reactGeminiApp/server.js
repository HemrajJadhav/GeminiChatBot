const PORT = 8000;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
// console.log("apiKey: ", process.env.GOOGLE_GENAI_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_KEY);

app.post("/gemini", async (req, res) => {
  console.log(req.body.history);
  console.log(req.body.message);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const chat = model.startChat({
    history: req.body.history.map((item) => ({
      role: item.role,
      parts: item.parts,
    })),
  });
  const msg = req.body.message;

  try {
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("something went wrong while processing your request.");
  }
});

app.listen(PORT, () => console.log("Listening on Port No.: ", PORT));
