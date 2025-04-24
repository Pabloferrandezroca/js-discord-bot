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

class User {
    protected static users: {[key:string]: User} = {}

    protected discordUser: DiscordUser
    protected id: string
    protected chat: Chat|null
    public lastIAMessage: Message|null
    protected status = Status.idle

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
            this.status = Status.inChat
            this.chat = await crearChat(username, Bot.client.user.username)
        }

    }

    public async sendMessage(message: string): Promise<string>
    {
        return await enviarMensaje(this.chat, message);
    }

    public isInChat(): boolean
    {
        return this.status === Status.inChat
    }

    public endChat(): void
    {
        this.status = Status.idle
        this.chat = undefined
    }
}

export { User }