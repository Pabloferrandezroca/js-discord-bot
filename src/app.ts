import 'dotenv/config'
import { Client, GatewayIntentBits, Events, TextChannel, Message } from 'discord.js'
import { User } from './class/User.mts'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

client.on(Events.ClientReady, readyClient => {
  console.log(`Sesión iniciada como ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, async message => {
//ignorar mensajes del propio bot
  if(client.user?.id === message.author.id){
    return
  }

  // solo recibe el mensaje si el canal es llamado *programaci*
  if(message.channel instanceof TextChannel && message.channel.name.toLocaleLowerCase().includes("programaci")){
    let user = User.getUser(message.author.id)

    if(message.content.startsWith("!")){
      // es un commando
      let content = message.content.substring(1)
      let args = content.split(' ')
      let command = args.shift()

      user.sentCommand(command, args, message)
    } else {
      if(user.isInChat && user.isLastChatMessage(message)){
        user.sendMessage(message)
      }
    }
  }

})

client.login(process.env.DISCORD_TOKEN)
console.log('Iniciando sesión...')