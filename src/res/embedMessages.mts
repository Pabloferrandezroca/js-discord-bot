import { EmbedBuilder } from "discord.js";

export const welcome = new EmbedBuilder()
  .setColor(0x007BFF)
  .setTitle('Bienvenido a facturascripts!')
  .setDescription('Si quieres reportar un problema con FacturaScripts o alguno de sus plugins, es mejor que uses la sección de contacto de la web -> https://facturascripts.com/contacto')
  .addFields(
    { name: 'Canal para dudas de programación', value: 'https://discord.com/channels/887339102842781758/887368553416773692' },
    { name: 'Canal para dudas sobre tracucciones', value: 'https://discord.com/channels/887339102842781758/887368587713601616' },
    { name: 'Canal para el resto de dudas', value: 'https://discord.com/channels/887339102842781758/887339102842781762 o https://discord.com/channels/887339102842781758/887399441638780958' }
  )