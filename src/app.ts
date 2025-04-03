import 'dotenv/config'

import { Client, GatewayIntentBits, Events, TextChannel, Message } from 'discord.js'
import { User } from './class/User.mts'
import { main } from './gemini';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

client.on(Events.ClientReady, readyClient => {
  console.log(`Sesión iniciada como ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, async message => {
/* <<<<<<< HEAD
  if (message.content.startsWith('!')){
    let pregunta = message.content.substring(1);
    let respuesta = main(pregunta);
    message.channel.send(await respuesta);
=======*/
  //ignorar mensajes del propio bot
  if(client.user?.id === message.author.id){
    return
  }

  // solo recibe el mensaje si el canal es llamado *programaci*
  if(message.channel instanceof TextChannel && message.channel.name.toLocaleLowerCase().includes("programaci")){
    let user = User.getUser(message.author.id)
    user.sentMessage(message)
  }

})

client.login(process.env.DISCORD_TOKEN)
console.log('Iniciando sesión...')