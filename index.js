import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const userSessions = new Map(); // Stores chat history per session

const generate = async (sessionId, userMessage) => {
  try {
    let chat = userSessions.get(sessionId);

    if (!chat) {
      chat = model.startChat({ history: [] , generationConfig:{
        maxOutputTokens:100
      }});
      userSessions.set(sessionId, chat);
    }

    const chatResult = await chat.sendMessage(userMessage);
    return chatResult.response.text();
  } catch (err) {
    console.log(err);
    return "An error occurred while processing your request.";
  }
};

app.get("/", (req, res) => {
  res.send("Hello world Gemini");
});

app.get("/api/content", async (req, res) => {
  try {
    const { question, sessionId } = req.query;
    if (!sessionId) return res.status(400).send({ error: "Session ID required" });

    const response = await generate(sessionId, question);
    res.send({ result: response });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Server error" });
  }
});

app.listen(4012, () => {
  console.log("Server is running on port 4012");
});
