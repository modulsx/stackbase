const fs = require('fs')
const path = require('path')
const config = require('../../config')
const { getValidatedDatabasesConfigSync } = require('./validations')

const runDatabasesSetup = () => {
    if(path.extname(config.DATABASES_CONFIG_PATH) !== '.json'){
        throw new Error('Deployments config must be a json file')
    }
    if (!fs.existsSync(config.DATABASES_CONFIG_PATH)){
        fs.mkdirSync(path.dirname(config.DATABASES_CONFIG_PATH), { recursive: true })
        fs.writeFileSync(config.DATABASES_CONFIG_PATH, JSON.stringify({databases: []}, null, 4))
    }
    getValidatedDatabasesConfigSync(config.DATABASES_CONFIG_PATH)
}

module.exports = {
    runDatabasesSetup
}