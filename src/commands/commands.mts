import { testCommand, testAction } from './test.mts'
import { viewCommand, execute } from './view.mts'
import { helpCommand, help } from './help.mts';
import { refreshCommand, refresh } from './refresh.mts';

type commandsType = {
    [key: string]: [any, any];
};

let commands: commandsType = {
    [testCommand.name]: [ testCommand, testAction ],
    [viewCommand.name]: [ viewCommand, execute ],
    [helpCommand.name]: [ helpCommand, help ],
    [refreshCommand.name]: [ refreshCommand, refresh ],
}

export { commands }