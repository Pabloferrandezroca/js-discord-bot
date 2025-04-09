import { Client, GatewayIntentBits, Events, TextChannel, EmbedBuilder, REST, Routes, MessageFlags, Embed, Message } from 'discord.js'
import { User } from './class/User.mts'
import { commands } from './commands/commands.mts'

import 'dotenv/config'
import './class/Configuration.mts'
import { helpCommand, help } from './commands/help.mts'

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
})

client.on(Events.ClientReady, async readyClient  => {
  console.log(`Sesión iniciada como ${readyClient.user.tag}`)

  console.log("Eliminando interacciones antiguas")
  await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: [] })
    .then(() => console.log('Slash commands cleared.'))
    .catch(console.error);
  console.log("Interacciones antiguas eliminadas")

  let slashCommands = []
  for (let propiedad in commands) {
    if (commands[propiedad][0]?.toJSON) {
      slashCommands.push(commands[propiedad][0].toJSON());
    }
  }

  try {
    console.log(`Informando sobre la existencia de ${slashCommands.length} comandos de aplicación(/).`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: slashCommands },
    ) as [any]

    //console.log(data)
    console.log(`Recargados correctamente ${data.length} comandos de aplicación(/).`);
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


client.on('interactionCreate', async interaction => {
  console.log("hola")
    if (interaction.isModalSubmit() && interaction.customId === 'helpModal') {
        const userInput = interaction.fields.getTextInputValue('helpInput');
        console.log(`El usuario escribió: ${userInput}`);
        await interaction.reply({
            content: `Recibido: ${userInput}`,
            ephemeral: false,
        });
    }
});

let welcome = new EmbedBuilder()
  .setColor(0x007BFF)
  .setTitle('Bienvenido a facturascripts!')
  .setDescription('Si quieres reportar un problema con FacturaScripts o alguno de sus plugins, es mejor que uses la sección de contacto de la web -> https://facturascripts.com/contacto')
  .addFields(
    { name: 'Canal para dudas de programación', value: 'https://discordapp.com/channels/1357254454230909082/1357634658300596316' },
    { name: 'Canal para dudas sobre tracucciones', value: 'https://discordapp.com/channels/1357254454230909082/1357634738516394024' },
    { name: 'Canal para el resto de dudas', value: 'https://discordapp.com/channels/1357254454230909082/1357254454839218178 o https://discordapp.com/channels/1357254454230909082/1357634764500111414' }
  )

client.on('guildMemberAdd', async member => {
  welcome
    .setTitle('Hola ' + member.user.displayName + ", Bienvendido a facturascripts!")
  member.send({ embeds: [welcome] });
})
export { welcome }

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return

  let command = commands[interaction.commandName]

  if(command){
    command[1](interaction)
  }else{
    interaction.reply(`No hay ningún comando nombrado \`${interaction.commandName}\`!`);
  }
})



client.login(process.env.DISCORD_TOKEN)
console.log('Iniciando sesión...')