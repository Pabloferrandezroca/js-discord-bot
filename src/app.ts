import 'dotenv/config'
import { Client, GatewayIntentBits, Events } from 'discord.js'
import { main } from './gemini';

// The Client and Intents are destructured from discord.js, since it exports an object by default. Read up on destructuring here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.MessageCreate, async message => {
  if (message.content.startsWith('!')){
    let pregunta = message.content.substring(1);
    let respuesta = main(pregunta);
    message.channel.send(await respuesta);
  }
});

client.login(process.env.DISCORD_TOKEN);