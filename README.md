# Sobre este repositorio

Este repositorio contiene el código fuente de un bot que contiene las siguientes funciones:

- Está conectado a la api de una IA generativa de texto
- Contacta con la api de facturascripts y recibe su documentación
- Alimenta al chatbot de gemini con la documentación todos los días
- Dispone de configuración persistente
- Si mencionas al bot te responderá de manera abreviada
- También tiene los siguientes comandos:
 - `view` muestra aspectos de la configuración y estadisticas del servidor
 - `set var` para modificar la configuración del bot
 - `ping` para comprobar que está activado el bot
 - `help chatbot` pedir ayuda a un chatbot (abre chat)
 - `warn` para que le de un aviso a un usuario del servidor
 - `purge channel` borra todos los mensajes que se puedan borrar de un canal (requiere de verificación)
- Dispone de un log para ver los mensajes con claridad en terminal


### Instrucciones

1. El paso previo es registrar el bot en la [web de discord](https://discord.com/developers/applications).
    - En [este video](https://www.youtube.com/watch?v=CaPBYyPX0rM&t=287s) se realiza ese paso desde el minuto 5:01 hasta 7:26
2. Una vez hecho eso, se crea el fichero de variables de entorno para tus credenciales (no se comparten con nadie)
    - Hacer `cp .env.template .env` y modificar o revisar el propio fichero (contiene instrucciones)
    - Casi todos los datos a rellenar se recogen del registro del bot en la web de discord
3. Instalar depencencias
    - Ejecutar `npm install`o `yarn install` (si dan errores los paquetes mejor usar `yarn`)
4. Compilar o compilar y ejecutar
    - Con `npm run dev` se compila y ejecuta
    - Con `npm run build` se compila solo
    - Con `node ./dist/app.mts` se ejecuta

#### Cosas a saber

- En la terminal hay información útil (por ejemplo un código para acciones sensibles)
- Existe configuración de compilación para producción y para desarrollo.
- **Importante**: Necesitarás una API KEY de facturascripts, gemini y la del bot para trabajar con él