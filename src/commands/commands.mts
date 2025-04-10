import { ChatInputCommandInteraction, type SlashCommandOptionsOnlyBuilder, type SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { testCommand, testAction } from './test.mts'
import { refreshCommandsCommand, refreshCommandsAction } from './refreshCommands.mts'
import { setCommand, setAction } from './set.mts'

type CommandCoupleType = {
    [x: string]: {
        command: SlashCommandOptionsOnlyBuilder;
        action: (interaction: ChatInputCommandInteraction) => void;
    } | {
        command: SlashCommandSubcommandsOnlyBuilder;
        action: (interaction: ChatInputCommandInteraction) => Promise<void>;
    };
}

let commands: CommandCoupleType = {
    [testCommand.name]: { command: testCommand, action: testAction},
    [refreshCommandsCommand.name]: { command: refreshCommandsCommand, action: refreshCommandsAction},
    [setCommand.name]: { command: setCommand, action: setAction},
}

export { commands }