import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { googleSignup } from "@/app/service/shared/sharedApi";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.name = profile.name;
                token.email = profile.email;
                token.picture = profile.picture;

                try {
                    const role = "user";
                    const response = await googleSignup({
                        fullName: profile.name,
                        email: profile.email,
                        profilePicture: profile.picture,
                        role: role,
                    });

                    if (response?.status) {
                        const { user, accessToken } = response.data;
                        token.accessToken = accessToken;
                        token.user = user;
                    } else {
                        console.error("Google signup failed:", response?.message);
                    }
                } catch (error) {
                    console.error("Error in googleSignup API:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
                session.accessToken = token.accessToken as string;
                session.user.id = token.user?.id;
                session.user.role = token.user?.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
