import { ChatInputCommandInteraction, type SlashCommandOptionsOnlyBuilder, type SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { testCommand, testAction } from './test.mts'
import { refreshCommandsCommand, refreshCommandsAction } from './refreshCommands.mts'
import { setCommand, setAction } from './set.mts'
import { viewCommand, execute } from './view.mts'
import { helpCommand, help } from './help.mts';
import { refreshCommand, refresh } from './refresh.mts';

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
    [viewCommand.name]: { command: viewCommand, action: execute},
    [helpCommand.name]: { command: helpCommand, action: help},
    [refreshCommand.name]: { command: refreshCommand, action: refresh},
}

export { commands }