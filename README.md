# Sobre este repositorio

Este repositorio contiene el código fuente de un bot que contiene las siguientes funciones:

- Configuración persistente
- Comandos:
 - `view` muestra aspectos de la configuración y estadisticas del servidor
 - `set var` para modificar la configuración del bot
 - `ping` para comprobar que está activado el bot
 - `help chatbot` pedir ayuda a un chatbot (abre chat)
 - `warn` para que le de un aviso a un usuario del servidor
 - `purge channel` borra todos los mensajes que se puedan borrar de un canal (requiere de verificación)
- Dispone de un log para ver los mensajes con claridad en terminal
- Está conectado a la api de una IA generativa de texto


### Instrucciones

1. Primero crea el fichero de variables de entorno para tus credenciales
    - Hacer `cp .env.template .env` y modificar o revisar el propio fichero (contiene instrucciones)
2. Instalar depencencias
    - Ejecutar `npm install`o `yarn install`
3. Compilar o compilar y ejecutar
    - Con `npm run dev` se compila y ejecuta
    - Con `npm run build` se compila solo
    - Con `node ./dist/app.mts` se ejecuta

#### Cosas a saber

- En la terminal hay información útil (por ejemplo un código para acciones sensibles)
- La configuración de compilación actual no es optima para producción ya que está enfocada más a desarrollo. Para empaquetarlo habría que generar otro script de compilación.