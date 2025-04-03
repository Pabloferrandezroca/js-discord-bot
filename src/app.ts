import 'dotenv/config'
import { Client, GatewayIntentBits, Events, SlashCommandBuilder, Collection, Interaction, CacheType } from 'discord.js'
import { User } from './class/User.mts'

// The Client and Intents are destructured from discord.js, since it exports an object by default. Read up on destructuring here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`)

  new SlashCommandBuilder()
      .setName('test')
      .setDescription('Una prueba para ver si funciona')
})

client.on(Events.MessageCreate, async message => {
  //ignorar mensajes del propio bot
  if(client.user?.id === message.author.id){ 
    return
  }

  let user = User.getUser(message.author.id)
  user.sentMessage(message)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

  let command = commands.get(interaction.commandName)

  if(command){
    command(interaction)
  }else{
    throw new Error("unknown command")
  }

	// if (interaction.commandName === 'ping') {
	// 	interaction.reply({ content: 'Secret Pong!'}); 
	// }
});

let commands = new Collection<string, (interaction: Interaction<CacheType>) => void>
commands.set("test",async interaction => {
  await interaction.reply({ content: "yes", ephemeral: true })
})

client.login(process.env.DISCORD_TOKEN)