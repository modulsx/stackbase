const config = require('../../config')
const { getValidatedDatabasesConfig} = require('./validations')

const findAllDatabases = async () => {
    const databasesConfig = await getValidatedDatabasesConfig(config.DATABASES_CONFIG_PATH)
    return databasesConfig.databases
}

const findOneDatabase = async (id) => {
    const databasesConfig = await getValidatedDatabasesConfig(config.DATABASES_CONFIG_PATH)
    return databasesConfig.databases.find(database => database.id === id)
}

module.exports = {
    findAllDatabases,
    findOneDatabase
}