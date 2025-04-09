import { testCommand, testAction } from './test.mts'
import { viewCommand, execute } from './view.mts'
import { helpCommand, help } from './help.mts';

type commandsType = {
    [key: string]: [any, any];
};

let commands: commandsType = {
    [testCommand.name]: [ testCommand, testAction ],
    [viewCommand.name]: [ viewCommand, execute ],
    [helpCommand.name]: [ helpCommand, help ]
}

export { commands }