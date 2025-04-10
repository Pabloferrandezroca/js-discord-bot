import 'colors'

export class Log {
    static info(msg: string, subCommand = 0)
    {
        if(subCommand === 0){
            console.log('==> ' + msg.cyan)
        }else{
            console.log('\t-> ' + msg.cyan)
        }
    }

    static success(msg: string, subCommand = 0)
    {
        if(subCommand === 0){
            console.log('==> ' + msg.green)
        }else{
            console.log('\t-> ' + msg.green)
        }
    }

    static warn(msg: string, subCommand = 0)
    {
        if(subCommand === 0){
            console.log('==> ' + msg.yellow)
        }else{
            console.log('\t-> ' + msg.yellow)
        }
    }

    static error(msg: string, subCommand = 0)
    {
        if(subCommand === 0){
            console.log('==> ' + msg.red)
        }else{
            console.log('\t-> ' + msg.red)
        }
    }
}