function isEnabled(clientId, clientSecret) {
    return clientId !== '' && clientId && !clientId.startsWith('GET_YOUR_OWN') && clientSecret !== '' && clientSecret && !clientSecret.startsWith('GET_YOUR_OWN');
}

module.exports = async () => {
    const grantConfig = {
        github: {
            enabled: isEnabled(process.env.GITHUB_ID, process.env.GITHUB_SECRET),
            key: process.env.GITHUB_ID || '',
            secret: process.env.GITHUB_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_NEXTJS_URL}/api/auth/github/callback`,
        },
        facebook: {
            enabled: isEnabled(process.env.FACEBOOK_CLIENT_KEY, process.env.FACEBOOK_CLIENT_SECRET),
            key: process.env.FACEBOOK_CLIENT_KEY || '',
            secret: process.env.FACEBOOK_CLIENT_SECRET || '',
        },
        discord: {
            enabled: isEnabled(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET),
            key: process.env.DISCORD_CLIENT_ID || '',
            secret: process.env.DISCORD_CLIENT_SECRET || '',
        },
        google: {
            enabled: isEnabled(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET),
            key: process.env.GOOGLE_CLIENT_ID || '',
            secret: process.env.GOOGLE_CLIENT_SECRET || '',
        },
        microsoft: {
            enabled: isEnabled(process.env.MICROSOFT_CLIENT_ID, process.env.MICROSOFT_CLIENT_SECRET),
            key: process.env.MICROSOFT_CLIENT_ID || '',
            secret: process.env.MICROSOFT_CLIENT_SECRET || '',
        },
        twitter: {
            enabled: isEnabled(process.env.TWITTER_ID, process.env.TWITTER_SECRET),
            key: process.env.TWITTER_ID || '',
            secret: process.env.TWITTER_SECRET || '',
        },
        instagram: {
            enabled: isEnabled(process.env.INSTAGRAM_CLIENT_ID, process.env.INSTAGRAM_CLIENT_SECRET),
            key: process.env.INSTAGRAM_CLIENT_ID || '',
            secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        },
        vk: {
            enabled: isEnabled(process.env.VK_CLIENT_ID, process.env.VK_CLIENT_SECRET),
            key: process.env.VK_CLIENT_ID || '',
            secret: process.env.VK_CLIENT_SECRET || '',
        },
        twitch: {
            enabled: isEnabled(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET),
            key: process.env.TWITCH_CLIENT_ID || '',
            secret: process.env.TWITCH_CLIENT_SECRET || '',
        },
        linkedin: {
            enabled: isEnabled(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET),
            key: process.env.LINKEDIN_CLIENT_ID || '',
            secret: process.env.LINKEDIN_CLIENT_SECRET || '',
        },
        cognito: {
            enabled: isEnabled(process.env.COGNITO_CLIENT_ID, process.env.COGNITO_CLIENT_SECRET),
            key: process.env.COGNITO_CLIENT_ID || '',
            secret: process.env.COGNITO_CLIENT_SECRET || '',
        },
        reddit: {
            enabled: isEnabled(process.env.REDDIT_CLIENT_ID, process.env.REDDIT_CLIENT_SECRET),
            key: process.env.REDDIT_CLIENT_ID || '',
            secret: process.env.REDDIT_CLIENT_SECRET || '',
        },
        auth0: {
            enabled: isEnabled(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_SECRET),
            key: process.env.AUTH0_CLIENT_ID || '',
            secret: process.env.AUTH0_CLIENT_SECRET || '',
            domain: process.env.AUTH0_DOMAIN || '',
        },
        cas: {
            enabled: isEnabled(process.env.CAS_CLIENT_ID, process.env.CAS_CLIENT_SECRET),
            key: process.env.CAS_CLIENT_ID || '',
            secret: process.env.CAS_CLIENT_SECRET || '',
        },
        patreon: {
            enabled: isEnabled(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET),
            key: process.env.PATREON_CLIENT_ID || '',
            secret: process.env.PATREON_CLIENT_SECRET || '',
        },
        keycloak: {
            enabled: isEnabled(process.env.KEYCLOAK_CLIENT_ID, process.env.KEYCLOAK_CLIENT_SECRET),
            key: process.env.KEYCLOAK_CLIENT_ID || '',
            secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
        }
    }
    const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const prevGrantConfig = (await pluginStore.get({ key: 'grant' })) || {}
    await pluginStore.set({ key: 'grant', value: { ...prevGrantConfig, ...grantConfig } });
}
