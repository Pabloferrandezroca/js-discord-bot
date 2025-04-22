import Jasmine from 'jasmine'
import c from 'colors'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __test = path.join(__dirname, 'dist', 'test')

console.log('\n==> Iniciando tests\n'.green)


if(!existsSync(__test)){
  console.log('\n==> Aviso: No se ha encontrado la carpeta de dist/test\n'.red)
  console.log('==> Cancelando...'.yellow)
  console.log('\n==> Cadena de testeo finalizada\n'.green)
  process.exit(1)
}

const runner = new Jasmine()
runner.env.clearReporters()
runner.env.addReporter({
  jasmineStarted: function(suiteInfo) {
    console.log(`\n==> Ejecutando ${suiteInfo.totalSpecsDefined} tests`.green);
  },

  suiteStarted: function(result) {
    console.log('\n===> ' + c.yellow(result.fullName))
  },

  specStarted: async function(result) {
    // console.log(' ---> ' + c.green(result.description))
  },

  specDone: function(result) {
    // console.log(`----------- ${result.status} ---------------`)
    if(result.status === 'passed'){
      console.log(' ---> ' + c.green(result.description + ' .OK'))
    }else if(result.status === 'failed'){
      console.log(' ---> ' + c.red(result.description + ' .FAIL'))
    }

    for (const expectation of result.failedExpectations) {
      console.log('------------------------------------------------------------------------'.black)
      console.log('  !-> Fallo: ' + expectation.message.yellow)
      // console.log(expectation.stack);
    }
    console.log('------------------------------------------------------------------------'.black)

    // console.log(result.passedExpectations.length);
  },

  suiteDone: function(result) {
    // console.log('Suite: ' + result.description + ' was ' + result.status);
    // for (const expectation of result.failedExpectations) {
    //   console.log('Suite ' + expectation.message);
    //   console.log(expectation.stack);
    // }
  },

  jasmineDone: function(result) {
    // console.log('Finished suite: ' + result.overallStatus);
    // for (const expectation of result.failedExpectations) {
    //   console.log('Global ' + expectation.message);
    //   console.log(expectation.stack);
    // }
  }
})

runner.loadConfig({
  spec_dir: 'dist/test',
  spec_files: [
    '**/*.[sS]pec.?(m)js'
  ],
  jsLoader: 'require',
  env: {
    stopSpecOnExpectationFailure: false,
    random: false,
    forbidDuplicateNames: false
  }
})
runner.exitOnCompletion = false

const result = await runner.execute()

// console.log(`\n==> Tiempo tardado: ${result.totalTime/1000} segundos.\n`.gray)
if (result.overallStatus === 'passed') {
  console.log('\n==> Todos los test están OK\n'.green)
} else {
  console.log(`\n==> Han fallado algunos tests\n`.yellow)
}

console.log('\n==> Cadena de testeo finalizada\n'.green)