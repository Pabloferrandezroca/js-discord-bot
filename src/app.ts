import 'dotenv/config'
import { Client, GatewayIntentBits, Events } from 'discord.js'

// The Client and Intents are destructured from discord.js, since it exports an object by default. Read up on destructuring here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.MessageCreate, message => {
  console.log("ha escrito el espabilao")
  if (message.content == "ping") {
    message.channel.send("pong!");
  }
});

client.login(process.env.DISCORD_TOKEN);