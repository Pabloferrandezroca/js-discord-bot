import { Message, User as DiscordUser } from "discord.js"
import { enviarMensaje, crearChat } from '../lib/gemini.mts';
import { Bot } from "./Bot.mts";
import type { Chat } from "@google/genai";

export enum Status {
    idle,
    inChat
}

// case 'test':
// message.react('✅')
// if (args.length > 9) {
//     message.react('🔼')
//     message.react('9️⃣')
// } else {
//     message.react(String.fromCodePoint(0x0030 + args.length) + "\u20E3")
// }
// return

interface AIChatType {
    chat: Chat|null
    lastIAMessage: Message|null,
    status: Status
}

class User {
    protected static users: {[key:string]: User} = {}
    
    protected discordUser: DiscordUser
    protected id: string

    public AIChat: AIChatType = {
        chat: null,
        lastIAMessage: null,
        status: Status.idle
    }

    protected constructor(userID: string)
    {
        User.users[userID] = this
        this.id = userID
        return this
    }

    public static getUser(user: DiscordUser): User
    {
        let userID = user.id
        return User.users[userID] ? User.users[userID] : new User(userID)
    }

    public async getDiscordUser(): Promise<DiscordUser>
    {
        return await Bot.client.users.fetch(this.id)
    }

    public getID(): string
    {
        return this.id
    }

    public async startChat(username: string)
    {
        if (!this.isInChat()) {
            this.AIChat.status = Status.inChat
            this.AIChat.chat = await crearChat(username, Bot.client.user.username)
        }
    }

    public async sendMessage(message: string): Promise<string>
    {
        return await enviarMensaje(this.AIChat.chat, message)
    }

    public isInChat(): boolean
    {
        return this.AIChat.status === Status.inChat
    }

    public endChat(): void
    {
        this.AIChat.status = Status.idle
        this.AIChat.chat = undefined
    }
}

export { User }