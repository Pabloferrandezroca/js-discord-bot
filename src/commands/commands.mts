import { ChatInputCommandInteraction, type SlashCommandOptionsOnlyBuilder, type SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { testCommand, testAction } from './test.mts'
import { setCommand, setAction } from './set.mts'
import { viewCommand, viewAction } from './view.mts'
import { helpCommand, helpAction } from './help.mts';
import { refreshCommand, refreshAction } from './refresh.mts';

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
    [setCommand.name]: { command: setCommand, action: setAction},
    [viewCommand.name]: { command: viewCommand, action: viewAction},
    [helpCommand.name]: { command: helpCommand, action: helpAction},
    [refreshCommand.name]: { command: refreshCommand, action: refreshAction},
}

export { commands, type CommandCoupleType }