import { ChatInputCommandInteraction, type SlashCommandOptionsOnlyBuilder, type SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { pingCommand, pingAction } from './ping.mts'
import { setCommand, setAction, setLoadCommand } from './set.mts'
import { viewCommand, viewAction } from './view.mts'
import { helpCommand, helpAction } from './help.mts';
import { warnCommand, warnAction } from './warn.mts'
import { purgeCommand, purgeAction } from './purge.mts';
import { deleteCommand, deleteAction } from './delete.mts';

export type CommandCoupleType = {
    [x: string]: {
        command: SlashCommandOptionsOnlyBuilder;
        action: (interaction: ChatInputCommandInteraction) => void;
    } | {
        command: SlashCommandSubcommandsOnlyBuilder;
        action: (interaction: ChatInputCommandInteraction) => Promise<void>;
    };
}

export type loadCommandsType = (() => Promise<void>)[]

export const slashCommandsLoadTasks: loadCommandsType = [
    setLoadCommand
]

export const slashCommands: CommandCoupleType = {
    [pingCommand.name]: { command: pingCommand, action: pingAction},
    [setCommand.name]: { command: setCommand, action: setAction},
    [viewCommand.name]: { command: viewCommand, action: viewAction},
    [helpCommand.name]: { command: helpCommand, action: helpAction},
    [warnCommand.name]: { command: warnCommand, action: warnAction},
    [purgeCommand.name]: { command: purgeCommand, action: purgeAction},
    [deleteCommand.name]: { command: deleteCommand, action: deleteAction}
}