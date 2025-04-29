import 'colors'

const lev1 = '==> '.white
const lev2 = '  -> '.white

// enum logLevel {
//     info,
//     success,
//     warning,
//     error
// }

export class Log {
    protected static logMessage(msg: string, subCommand: number, color: string)
    {
        process.stdout.write(this.getElapsedTime()+' ')
        process.stdout.write(subCommand === 0 ? lev1 : lev2)
        process.stdout.write(msg[color])
        process.stdout.write("\n")
    }

    protected static getElapsedTime() {
        const totalMiliseconds = Math.floor(performance.now())
        const totalSeconds = Math.floor(totalMiliseconds / 1000)
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
        const s = String(totalSeconds % 60).padStart(2, '0')
        const ms = String(totalMiliseconds).substring(0, 2).padStart(2, '0')
        return `[${h}:${m}:${s}:${ms}]`;
      }

    static info(msg: string, subCommand = 0)
    {
        this.logMessage(msg, subCommand, 'cyan')
    }

    static success(msg: string, subCommand = 0)
    {
        this.logMessage(msg, subCommand, 'green')
    }

    static warn(msg: string, subCommand = 0)
    {
        this.logMessage(msg, subCommand, 'yellow')
    }

    static error(msg: string, subCommand = 0)
    {
        this.logMessage(msg, subCommand, 'red')
    }
}