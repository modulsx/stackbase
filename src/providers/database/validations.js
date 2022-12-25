const Joi = require('joi');
const fs = require('fs')

const databaseSchema = Joi.object({
    id: Joi.string().guid({
        version: [
            'uuidv4',
        ]
    }).required(),
    database_url: Joi.string().required()
})

const databasesSchema = Joi.object({
    databases: Joi.array().unique('id').items(databaseSchema).required(),
})

const getValidatedDatabasesConfig =  async (jsonFile) => {
    const databasesConfigFile = await fs.promises.readFile(jsonFile, 'utf8');
    const databasesConfigJson = JSON.parse(databasesConfigFile)
    return databasesSchema.validateAsync(databasesConfigJson)
}

const getValidatedDatabasesConfigSync = (jsonFile) => {
    const databasesConfigFile = fs.readFileSync(jsonFile, 'utf8')
    const databasesConfigJson = JSON.parse(databasesConfigFile)
    const { error, value }  = databasesSchema.validate(databasesConfigJson)
    if(error){
        throw new Error(`Databases Config Validation Error: ${error.message}`)
    }
    return value
}

module.exports = {
    getValidatedDatabasesConfig,
    getValidatedDatabasesConfigSync
}
