import { EmbedBuilder } from "discord.js";

export const welcome = new EmbedBuilder()
  .setColor(0x007BFF)
  .setTitle('Bienvenido a facturascripts!')
  .setDescription('Si quieres reportar un problema con FacturaScripts o alguno de sus plugins, es mejor que uses la sección de contacto de la web -> https://facturascripts.com/contacto')
  .addFields(
    { name: 'Canal para dudas de programación', value: 'https://discordapp.com/channels/1357254454230909082/1357634658300596316' },
    { name: 'Canal para dudas sobre tracucciones', value: 'https://discordapp.com/channels/1357254454230909082/1357634738516394024' },
    { name: 'Canal para el resto de dudas', value: 'https://discordapp.com/channels/1357254454230909082/1357254454839218178 o https://discordapp.com/channels/1357254454230909082/1357634764500111414' }
  )