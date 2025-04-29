import 'dotenv/config'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.CHATBOT_API_KEY })

console.log("My files:");
let pager = await ai.files.list({ config: { pageSize: 100 } });
let page = pager.page;
while (true) {
  for (const c of page) {
    console.log("    ", c.name);
  }
  if (!pager.hasNextPage()) break;
  page = await pager.nextPage();
}

console.log("My caches:");
pager = await ai.caches.list({ config: { pageSize: 1000 } });
page = pager.page;
while (true) {
  for (const c of page) {
    console.log("    ", c.name);
  }
  if (!pager.hasNextPage()) break;
  page = await pager.nextPage();
}