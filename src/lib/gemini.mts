import 'dotenv/config'
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function crearChat(username: string)
{
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hola, necesito ayuda" }],
      },
      {
        role: "model",
        parts: [{ text: `Hola (nombre el usuario:<<${username}>>), ¿en que puedo ayudarte hoy?` }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  return chat;
}

export async function enviarMensaje(chat: ChatSession, mensaje: string): Promise<string>
{
  const result = await chat.sendMessage(mensaje);
  const respuesta = await result.response;
  return respuesta.text();
}

// let history: Array<any> = [];
// export async function main(mensaje: string): Promise<string> {
//   history.push({
//     role: "user",
//     parts: [{ text: mensaje }],
//   });

//   const chat = crearChat(history, model);

//   const text = await enviarMensaje(chat, mensaje);

//   history.push({
//     role: "model",
//     parts: [{ text: text }],
//   });

//   return text as unknown as string;
// }




