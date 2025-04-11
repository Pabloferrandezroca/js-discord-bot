import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Bot } from "../class/Bot.mts";

const pingCommand = new SlashCommandBuilder()
.setName('ping')
.setDescription('Comprueba que funciona correctamente la interacción')


let pingAction = (interaction: ChatInputCommandInteraction) => {
    message.setFields(
        { name: 'Latencia:', value: `${Date.now() - interaction.createdTimestamp}ms` },
        { name: 'Latencia de API', value: `${Math.round(Bot.client.ws.ping)}ms` }
    )
    interaction.reply( { embeds: [message] })//, flags: MessageFlags.Ephemeral })
}

let message = new EmbedBuilder()
  .setColor(0x007BFF)
  .setTitle('🟢 Bot operativo')
  .setDescription('Bot a la escucha perfectamente🚀')

export { pingCommand, pingAction }