import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ account }) {
            if (account?.provider === 'google') {
                try {
                    return true;
                } catch (error) {
                    console.error("Sign-in error:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.name = profile.name;
                token.email = profile.email;
                token.picture = profile.image;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                ...session.user,
                email: token.email,
                name: token.name,
                image: token.picture,
            };
            return session;
        }
    },

    pages: {
        signIn: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
