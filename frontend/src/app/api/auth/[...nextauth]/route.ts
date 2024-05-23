import { StrapiErrorT } from '@/types/strapi/StrapiError'
import { StrapiLoginResponseT } from '@/types/strapi/User'
import NextAuth, { Account, Session, SessionStrategy, User } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'
import BattleNetProvider from 'next-auth/providers/battlenet'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from 'next-auth/providers/discord'

interface Provider {
  provider: any;
  id: string;
  secret: string;
  options?: Record<string, unknown>;
}

const providers: Provider[] = [
  { provider: GitHubProvider, id: 'GITHUB_ID', secret: 'GITHUB_SECRET' },
  { provider: GoogleProvider, id: 'GOOGLE_CLIENT_ID', secret: 'GOOGLE_CLIENT_SECRET' },
  { provider: SpotifyProvider, id: 'SPOTIFY_CLIENT_ID', secret: 'SPOTIFY_CLIENT_SECRET' },
  { provider: BattleNetProvider, id: 'BATTLENET_CLIENT_ID', secret: 'BATTLENET_CLIENT_SECRET', options: { region: 'eu' } },
  { provider: TwitterProvider, id: 'TWITTER_ID', secret: 'TWITTER_SECRET', options: { version: '2.0' } },
  { provider: DiscordProvider, id: 'DISCORD_CLIENT_ID', secret: 'DISCORD_CLIENT_SECRET' }
  // ...add more providers here
]

function isEnabled(clientId: string | undefined, clientSecret: string | undefined): boolean {
  return !!(clientId !== '' && clientId && !clientId.startsWith('GET_YOUR_OWN') && clientSecret !== '' && clientSecret && !clientSecret.startsWith('GET_YOUR_OWN'))
}

const enabledProviders = providers
  .filter(provider => isEnabled(process.env[provider.id], process.env[provider.secret]))
  .map(provider => {
    return provider.provider({
      clientId: process.env[provider.id],
      clientSecret: process.env[provider.secret],
      ...provider.options
    })
  })

const handler = NextAuth({
  providers: enabledProviders,
  session: {
    strategy: 'jwt' as SessionStrategy
  },
  callbacks: {
    async jwt({ token, trigger, account, user, session }: { token: any; trigger?: string; account: Account | null; user: User; session?: Session }) {

      // change username update
      if (trigger === 'update' && session?.username) {
        token.name = session.username
      }

      // change password update
      if (trigger === 'update' && session?.strapiToken) {
        token.strapiToken = session.strapiToken
      }

      if (account) {
        if (account.provider === 'google' || account.provider === 'github' || account.provider === 'spotify' || account.provider === 'twitter' || account.provider === 'discord') {
          // we now know we are doing a sign in using GoogleProvider
          try {
            const strapiResponse = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
              {
                cache: 'no-cache'
              }
            )
            if (!strapiResponse.ok) {
              const strapiError: StrapiErrorT = await strapiResponse.json()
              throw new Error(strapiError.error.message)
            }
            const strapiLoginResponse: StrapiLoginResponseT = await strapiResponse.json()
            console.log('strapiLoginResponse', strapiLoginResponse)
            // customize token
            // name and email will already be on here
            token.strapiToken = strapiLoginResponse.jwt
            token.strapiUserId = strapiLoginResponse.user.id
            token.role = strapiLoginResponse.user.role
            token.provider = account.provider
            token.blocked = strapiLoginResponse.user.blocked
          } catch (error) {
            throw error
          }
          // token.strapiToken = user.strapiToken
          // token.strapiUserId = user.strapiUserId
          // token.role = user.role
          // token.provider = account.provider
          // token.blocked = user.blocked
        }
        if (account.provider === 'battlenet') {
          console.log('battlenet account and user: ', account, user)
          const userinfo = await fetch(`https://oauth.battle.net/oauth/userinfo`, {
            headers: {
              region: 'eu',
              Authorization: `Bearer ${account.access_token}`
            }
          }).then((res) => res.json())
          console.log('userinfo', userinfo)
        }
        if (account.provider === 'credentials') {
          // for credentials, not google provider
          // name and email are taken care of by next-auth or authorize
          token.strapiToken = user.strapiToken
          token.strapiUserId = user.strapiUserId
          token.role = user.role
          token.provider = account.provider
          token.blocked = user.blocked
        }
      }
      return token
    },
    async session({ token, session }: any) {
      // console.log('session callback', {
      //   token,
      //   session,
      // });

      session.strapiToken = token.strapiToken
      session.provider = token.provider
      session.user.strapiUserId = token.strapiUserId
      session.user.role = token.role
      session.user.blocked = token.blocked

      return session
    }
  }
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
})

export { handler as GET, handler as POST }
