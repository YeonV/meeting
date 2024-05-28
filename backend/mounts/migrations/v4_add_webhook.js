module.exports = async () => {
    const body = {
        id: '1',
        name: 'NextJS',
        url: `${process.env.NEXT_PUBLIC_NEXTJS_URL_DOCKER}/api/strapi`,
        headers: {},
        events: ['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish', 'media.create', 'media.update', 'media.delete'],
        isEnabled: true
    }
    const webhook = await strapi.webhookStore.createWebhook(body);
    strapi.webhookRunner.add(webhook);
}
