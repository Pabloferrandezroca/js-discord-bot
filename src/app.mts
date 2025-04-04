
import { Client, GatewayIntentBits, Events, TextChannel, EmbedBuilder, REST, Routes, MessageFlags } from 'discord.js'
import { User } from './class/User.mts'
import { commands } from './commands/commands.mts'

import 'dotenv/config'
import './class/Configuration.mts'

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
})

client.on(Events.ClientReady, async readyClient  => {
  console.log(`Sesión iniciada como ${readyClient.user.tag}`)

  await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })
    .then(() => console.log('Slash commands cleared.'))
    .catch(console.error);

  let slashCommands = []
  for (let propiedad in commands) {
    slashCommands.push(commands[propiedad][0].toJSON())
  }

  try {
    console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: slashCommands },
    ) as [any]

    //console.log(data)
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }

  //console.log(await rest.get(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] }))
})

client.on(Events.MessageCreate, async message => {
  //ignorar mensajes del propio bot
  if (client.user?.id === message.author.id) {
    return
  }

  // solo recibe el mensaje si el canal es llamado *programaci*
  if (message.channel instanceof TextChannel && message.channel.name.toLocaleLowerCase().includes("programaci")) {
    let user = User.getUser(message.author.id)

    if (message.content.startsWith("!")) {
      // es un commando
      let content = message.content.substring(1)
      let args = content.split(' ')
      let command = args.shift()

      user.sentCommand(command, args, message)
    } else {
      if (user.isInChat && user.isLastChatMessage(message)) {
        user.sendMessage(message)
      }
    }
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

client.on(Events.InteractionCreate, async interaction => {
  console.log(interaction)
  if (!interaction.isChatInputCommand()) return

  interaction.reply( { content: 'Todo ok!', flags: MessageFlags.Ephemeral })

  let command = commands[interaction.commandName]

  if(command){
    command[1](interaction)
  }
})



client.login(process.env.DISCORD_TOKEN)
console.log('Iniciando sesión...')