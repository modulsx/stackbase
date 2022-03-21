const webhookPingEvent = async (ctx, next) => {
    const headers = ctx.request.header
    if(headers['x-github-event'] === 'ping'){
        ctx.status = 200;
        return ctx.body = 'accepted';
    }
    await next()
}

module.exports = {
    webhookPingEvent,
};