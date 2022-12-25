const router = require('@koa/router')();
const koaBody = require('koa-body');
const proxy = require('koa-better-http-proxy');
const pgConnUrlParser = require('pg-connection-string').parse;
const { isAuthenticated }= require('../middlewares/auth')
const { findAllDatabases, findOneDatabase } = require('../providers/database/api')


router.get('/db-manager', isAuthenticated, async (ctx) => {
    const databases = await findAllDatabases()
    const filterDatabases =  databases.map(database => {
        const dbConfig = pgConnUrlParser(database.database_url)
        return { id: database.id, name: `${dbConfig.database} (DB)` }
    })
    return await ctx.render('db-manager/index', {
        databases: filterDatabases,
        route: 'db-manager'
    });
});

router.post('/db-manager/get-connection-url', koaBody(), async (ctx) => {
    const body = ctx.request.body
    const database = await findOneDatabase(body.resource)
    if(database){
        return ctx.body = { database_url : database.database_url}
    }
    else {
        return ctx.status = 400
    }

})

router.all('/pgweb/(.*)', isAuthenticated, proxy('localhost:8081'));

module.exports = router;