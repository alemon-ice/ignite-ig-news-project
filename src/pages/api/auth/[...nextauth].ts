import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization:
        'https://github.com/login/oauth/authorize?scope=read:user+user:email',
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ])
          )
        );
        console.log({ userActiveSubscription });

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection('users'), { data: { email: user.email } }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email)))
          )
        );

        return true;
      } catch (err) {
        return false;
      }
    },
  },
});
