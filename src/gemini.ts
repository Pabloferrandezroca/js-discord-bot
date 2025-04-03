// src/app.ts
import { GoogleGenAI } from "@google/genai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


let history: Array<any> = [];
export async function main(mensaje: string): Promise<string> {
  history.push({
    role: "user",
    parts: [{ text: mensaje }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: mensaje,
  });

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = crearChat(history, model);

  const text = await enviarMensaje(chat, mensaje);

  history.push({
    role: "model",
    parts: [{ text: text }],
  });

  return text as unknown as string;
}



async function enviarMensaje(chat, mensaje: string):Promise<string> {
  const result = await chat.sendMessage(mensaje);
  const respuesta = await result.response;
  return respuesta.text();
}

function crearChat(history: Array<any>, model) {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });
  return chat;
}