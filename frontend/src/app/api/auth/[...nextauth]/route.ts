import { StrapiErrorT } from '@/types/strapi/StrapiError'
import { StrapiLoginResponseT } from '@/types/strapi/User'
import NextAuth, { Account, Session, SessionStrategy, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import BattleNet from 'next-auth/providers/battlenet'
import Discord from 'next-auth/providers/discord'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Spotify from 'next-auth/providers/spotify'
import Twitter from 'next-auth/providers/twitter'

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    Github({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
    }),
    BattleNet({
      clientId: process.env.BATTLENET_CLIENT_ID || '',
      clientSecret: process.env.BATTLENET_CLIENT_SECRET || '',
      issuer: 'https://eu.battle.net/oauth'
    }),
    Twitter({
      clientId: process.env.TWITTER_ID || '',
      clientSecret: process.env.TWITTER_SECRET || '',
      version: '2.0' // opt-in to Twitter OAuth 2.0
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    })
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt' as SessionStrategy
  },
  callbacks: {
    async jwt({ token, trigger, account, user, session }: { token: any; trigger?: string; account: Account | null; user: User; session?: Session }) {
      // console.log('jwt callback', {
      //   token,
      //   trigger,
      //   account,
      //   user,
      //   session,
      // });

      // change username update
      if (trigger === 'update' && session?.username) {
        token.name = session.username
      }

      // change password update
      if (trigger === 'update' && session?.strapiToken) {
        token.strapiToken = session.strapiToken
      }

      if (account) {
        if (account.provider === 'google') {
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
              // console.log('strapiError', strapiError);
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
