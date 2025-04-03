import { Message } from "discord.js"

class User {
    protected static users: {[key:string]: User} = {}

    protected id: string
    protected chat: object|null
    protected lastBotResponseId: string = ""

    protected constructor(userID: string)
    {
        User.users[userID] = this
        this.id = userID
        this.chat = {}
        return this
    }

    public static getUser(userID: string): User
    {
        return User.users[userID] ? User.users[userID] : new User(userID)
    }

    public sentMessage(message: Message): void
    {
        //let replied = message.reference?.messageId

        //message.reply(`Hola manin ${message.author.displayName}||<@${message.author.id}>||!`)
        //message.reply(`Hola manin`)
        // if (enviadoPorBotID === replied){
        //     message.reply("A esta te respondo yo")
        // }
        // if (message.content.toLocaleLowerCase() == "ping") {
        //     let mess = await message.reply("Te esperabas pong no? "+message.author.username+" pues no te la llevas")
        //     enviadoPorBotID = mess.id
        // }
    }
}

export { User }