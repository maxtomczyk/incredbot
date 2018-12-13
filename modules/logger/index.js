const levelsNumbers = {
    debug: 4,
    info: 3,
    warning: 2,
    error: 1
}

class Logger {
    constructor(config, moduleName) {
        this.moduleName = moduleName
        this.logLevel = config.log_level || 'debug'
        this.logLevelN = levelsNumbers[this.logLevel]
        if (!this.logLevelN) {
            this.logLevelN = levelsNumbers.debug
            console.log('xf')
            this.warn(`Logging level ${this.logLevel} not supported. Setting level to debug`)
        }
    }

    debug(msg) {
        const string = `[INCREDBOT][${this.moduleName} MODULE][DEBUG] ${msg}`
        this.logToConsole(string)
    }

    info(msg) {
        const string = `[INCREDBOT][${this.moduleName} MODULE][INFO] ${msg}`
        this.logToConsole(string)
    }

    warn(msg) {
        const string = `[INCREDBOT][${this.moduleName} MODULE][WARNING] ${msg}`
        this.logToConsole(string)
    }

    error(msg) {
        const string = `[INCREDBOT][${this.moduleName} MODULE][ERROR] ${msg}`
        this.logToConsole(string)
    }

    logToConsole(str) {
        console.log(str)
    }
}

module.exports = Logger
