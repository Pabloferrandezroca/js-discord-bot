import { EmbedBuilder, Message } from "discord.js"
import { enviarMensaje, crearChat } from '../lib/gemini.mts';
import { ChatSession } from "@google/generative-ai"
import { Configuration } from "./Configuration.mts";

const conf = Configuration.getConfiguration()

export enum Status {
    idle,
    inChat
}

class User {
    protected static users: {[key:string]: User} = {}

    protected id: string
    protected chat: ChatSession|null
    protected status = Status.idle
    protected lastBotResponseId: string = ""

    protected constructor(userID: string)
    {
        User.users[userID] = this
        this.id = userID
        return this
    }

    public static getUser(userID: string): User
    {
        return User.users[userID] ? User.users[userID] : new User(userID)
    }

    public async sentCommand(command: string, args: string[], message: Message): Promise<void>
    {
        switch (command) {
            case 'test':
                message.react('✅')
                if(args.length > 9){
                    message.react('🔼')
                    message.react('9️⃣')
                }else{
                    message.react(String.fromCodePoint(0x0030 + args.length)+"\u20E3")
                }
                return
            case 'ayuda':
                if(this.status !== Status.inChat){
                    let replyMessage = await message.reply(`Hola ${message.author.displayName}, ¿en que puedo ayudarte hoy?||responde a este mensaje para comunicarte conmigo||`)
                    this.chat = crearChat(message.author.displayName)
                    this.lastBotResponseId = replyMessage.id
                    this.status = Status.inChat
                }else{
                    message.reply('Ya estás en un chat, usa `!terminar chat` para cerrarlo.')
                }
                return
            case 'show':
                switch (args[0]) {
                    case 'configuration':
                        let outMess = ''
                        conf.getProperties().forEach((property) => {
                            outMess += `- \`${property} = ${Configuration[property]}\`\n`
                        });
                        let embed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Propiedades')
                            .setDescription(outMess)
                            // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                            // .addFields(
                            //     { name: 'Regular field title', value: 'Some value here' },
                            //     { name: '\u200B', value: '\u200B' },
                            //     { name: 'Inline field title', value: 'Some value here', inline: true },
                            //     { name: 'Inline field title', value: 'Some value here', inline: true },
                            // )
                            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                            // .setImage('https://i.imgur.com/AfFp7pu.png')
                            .setTimestamp()
                            // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
                        
                        message.reply({ embeds: [embed] })
                        return
                }
        }
    }

    public async sendMessage(message: string, username: string): Promise<string>
    {
        let respuestaDeIA = "";
        if (this.status === Status.idle) {
            this.chat = crearChat(username)
            this.status = Status.inChat
            respuestaDeIA = await enviarMensaje(this.chat, message)
        }
        else{
            respuestaDeIA = await enviarMensaje(this.chat, message)
        }

        return respuestaDeIA;
        //let replied = message.reference?.messageId

        //message.reply(`Hola manin`)
        // if (enviadoPorBotID === replied){
        //     message.reply("A esta te respondo yo")
        // }
        // if (message.content.toLocaleLowerCase() == "ping") {
        //     let mess = await message.reply("Te esperabas pong no? "+message.author.username+" pues no te la llevas")
        //     enviadoPorBotID = mess.id
        // }
    }

    public isInChat(): boolean
    {
        return this.status === Status.inChat
    }

    public isLastChatMessage(message): boolean
    {
        return this.lastBotResponseId === message.reference?.messageId
    }
}

export { User }