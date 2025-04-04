import 'dotenv/config'
import { Client, GatewayIntentBits, Events, TextChannel, EmbedBuilder } from 'discord.js'
import { User } from './class/User.mts'
import { main } from './gemini';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
})

client.on(Events.ClientReady, readyClient => {
  console.log(`Sesión iniciada como ${readyClient.user.tag}`)
})

client.on(Events.MessageCreate, async message => {
//ignorar mensajes del propio bot
  if(client.user?.id === message.author.id){
    return
  }
  if (message.content.startsWith('!')){
    let pregunta = message.content.substring(1);
    let respuesta = main(pregunta);
    message.channel.send(await respuesta);

  }

  // solo recibe el mensaje si el canal es llamado *programaci*
  if(message.channel instanceof TextChannel && message.channel.name.toLocaleLowerCase().includes("programaci")){
    let user = User.getUser(message.author.id)
    user.sentMessage(message)
  }

})

client.on('guildMemberAdd', async member => {
  const embed = new EmbedBuilder()
  .setColor(0x007BFF) // Puedes usar un color en hexadecimal
  .setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
  .setDescription('Si quieres reportar un problema con FacturaScripts o alguno de sus plugins, es mejor que uses la sección de contacto de la web -> https://facturascripts.com/contacto')
  .addFields(
    { name: 'Canal para dudas de programación', value: 'https://discordapp.com/channels/1357254454230909082/1357634658300596316' },
    { name: 'Canal para dudas sobre tracucciones', value: 'https://discordapp.com/channels/1357254454230909082/1357634738516394024' },
    { name: 'Canal para el resto de dudas', value: 'https://discordapp.com/channels/1357254454230909082/1357254454839218178 o https://discordapp.com/channels/1357254454230909082/1357634764500111414' }
  )
  member.send({ embeds: [embed] });
})



client.login(process.env.DISCORD_TOKEN)
console.log('Iniciando sesión...')