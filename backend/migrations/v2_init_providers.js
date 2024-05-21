function isEnabled(clientId, clientSecret) {
    return clientId !== '' && clientId && !clientId.startsWith('GET_YOUR_OWN') && clientSecret !== '' && clientSecret && !clientSecret.startsWith('GET_YOUR_OWN');
}

module.exports = async () => {
    const grantConfig = {
        github: {
            enabled: isEnabled(process.env.GITHUB_ID, process.env.GITHUB_SECRET),
            icon: "github",
            key: process.env.GITHUB_ID || '',
            secret: process.env.GITHUB_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/github/callback`,
            scope: ["user", "user:email"],
            redirect_uri: "/auth/github/callback",
            redirectUri: `${process.env.NEXT_PUBLIC_NEXTJS_URL}/api/connect/github/callback`
        },
        facebook: {
            enabled: isEnabled(process.env.FACEBOOK_CLIENT_KEY, process.env.FACEBOOK_CLIENT_SECRET),
            icon: "facebook-square",
            key: process.env.FACEBOOK_CLIENT_KEY || '',
            secret: process.env.FACEBOOK_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/facebook/callback`,
            scope: ["email"]
        },
        email: {
            enabled: true,
            icon: 'envelope',
        },
        discord: {
            enabled: isEnabled(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET),
            icon: 'discord',
            key: process.env.DISCORD_CLIENT_ID || '',
            secret: process.env.DISCORD_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/discord/callback`,
            scope: ['identify', 'email'],
        },
        google: {
            enabled: isEnabled(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET),
            icon: 'google',
            key: process.env.GOOGLE_CLIENT_ID || '',
            secret: process.env.GOOGLE_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/google/callback`,
            scope: ['email'],
        },
        microsoft: {
            enabled: isEnabled(process.env.MICROSOFT_CLIENT_ID, process.env.MICROSOFT_CLIENT_SECRET),
            icon: 'windows',
            key: process.env.MICROSOFT_CLIENT_ID || '',
            secret: process.env.MICROSOFT_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/microsoft/callback`,
            scope: ['user.read'],
        },
        twitter: {
            enabled: isEnabled(process.env.TWITTER_ID, process.env.TWITTER_SECRET),
            icon: 'twitter',
            key: process.env.TWITTER_ID || '',
            secret: process.env.TWITTER_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/twitter/callback`,
        },
        instagram: {
            enabled: isEnabled(process.env.INSTAGRAM_CLIENT_ID, process.env.INSTAGRAM_CLIENT_SECRET),
            icon: 'instagram',
            key: process.env.INSTAGRAM_CLIENT_ID || '',
            secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/instagram/callback`,
            scope: ['user_profile'],
        },
        vk: {
            enabled: isEnabled(process.env.VK_CLIENT_ID, process.env.VK_CLIENT_SECRET),
            icon: 'vk',
            key: process.env.VK_CLIENT_ID || '',
            secret: process.env.VK_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/vk/callback`,
            scope: ['email'],
        },
        twitch: {
            enabled: isEnabled(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET),
            icon: 'twitch',
            key: process.env.TWITCH_CLIENT_ID || '',
            secret: process.env.TWITCH_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/twitch/callback`,
            scope: ['user:read:email'],
        },
        linkedin: {
            enabled: isEnabled(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET),
            icon: 'linkedin',
            key: process.env.LINKEDIN_CLIENT_ID || '',
            secret: process.env.LINKEDIN_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/linkedin/callback`,
            scope: ['r_liteprofile', 'r_emailaddress'],
        },
        cognito: {
            enabled: isEnabled(process.env.COGNITO_CLIENT_ID, process.env.COGNITO_CLIENT_SECRET),
            icon: 'aws',
            key: process.env.COGNITO_CLIENT_ID || '',
            secret: process.env.COGNITO_CLIENT_SECRET || '',
            subdomain: 'my.subdomain.com',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/cognito/callback`,
            scope: ['email', 'openid', 'profile'],
        },
        reddit: {
            enabled: isEnabled(process.env.REDDIT_CLIENT_ID, process.env.REDDIT_CLIENT_SECRET),
            icon: 'reddit',
            key: process.env.REDDIT_CLIENT_ID || '',
            secret: process.env.REDDIT_CLIENT_SECRET || '',
            state: true,
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/reddit/callback`,
            scope: ['identity'],
        },
        auth0: {
            enabled: isEnabled(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_SECRET),
            icon: '',
            key: process.env.AUTH0_CLIENT_ID || '',
            secret: process.env.AUTH0_CLIENT_SECRET || '',
            subdomain: 'my-tenant.eu',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/auth0/callback`,
            scope: ['openid', 'email', 'profile'],
        },
        cas: {
            enabled: isEnabled(process.env.CAS_CLIENT_ID, process.env.CAS_CLIENT_SECRET),
            icon: 'book',
            key: process.env.CAS_CLIENT_ID || '',
            secret: process.env.CAS_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/cas/callback`,
            scope: ['openid email'], // scopes should be space delimited
            subdomain: 'my.subdomain.com/cas',
        },
        patreon: {
            enabled: isEnabled(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET),
            icon: '',
            key: process.env.PATREON_CLIENT_ID || '',
            secret: process.env.PATREON_CLIENT_SECRET || '',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/patreon/callback`,
            scope: ['identity', 'identity[email]'],
        },
        keycloak: {
            enabled: isEnabled(process.env.KEYCLOAK_CLIENT_ID, process.env.KEYCLOAK_CLIENT_SECRET),
            icon: '',
            key: process.env.KEYCLOAK_CLIENT_ID || '',
            secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
            subdomain: 'myKeycloakProvider.com/realms/myrealm',
            callback: `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/keycloak/callback`,
            scope: ['openid', 'email', 'profile'],
        }
    }
    const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const prevGrantConfig = (await pluginStore.get({ key: 'grant' })) || {}
    await pluginStore.set({ key: 'grant', value: { ...prevGrantConfig, ...grantConfig } });
}
