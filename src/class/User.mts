import { Message } from "discord.js"

export enum Status {
    idle,
    inChat
}

class User {
    protected static users: {[key:string]: User} = {}

    protected id: string
    protected chat: object|null
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

    public async sentCommand(command: string, args: string[], message: Message): void
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
                break;
            case 'ayuda':
                if(this.status !== Status.inChat){
                    let replyMessage = await message.reply(`Hola ${message.author.displayName}, ¿en que puedo ayudarte hoy?||responde a este mensaje para comunicarte conmigo||`)
                    //this.chat = ai.getNewchat()
                    this.lastBotResponseId = replyMessage.id
                }else{
                    message.reply('Ya estás en un chat, usa `!terminar chat` para cerrarlo.')
                }
        }
    }

    public sendMessage(message: Message): void
    {
        
        // ia.enviarMensajeAlChat

        // message.reply(respuestaDeIA)
        
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