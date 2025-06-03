import { googleSignup } from "@/app/service/shared/sharedApi";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


type GoogleProfile = {
    picture?: string;
    email?: string;
    name?: string;
    sub?: string;
};

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            console.log("Google Profile:", profile);
            console.log("Google Account:", account);
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.includes("/expert/")) {
                return `${baseUrl}/expert/dashboard`;
            }
            return `${baseUrl}/home`;
        },
        async jwt({ token, account, profile }) {
            if (account?.provider) {
                const { name, email, sub, picture } = profile as GoogleProfile;

                try {
                    let res: GoogleSignupResponse | undefined;
                    const isExpert = account.provider === 'google-expert';

                    if (isExpert) {
                        res = await googleExpertSignup({
                            name: name || "",
                            email: email || "",
                            image: picture,
                        });
                    } else {
                        res = await googleSignup({
                            fullName: name || "",
                            email: email || "",
                            image: picture,
                        });
                    }
                    console.log("3248", res)

                    if (res?.status) {
                        return {
                            ...token,
                            id: sub,
                            googleId: sub,
                            access: res.data.token,
                            userData: { ...res.data.userData, id: res.data.userData._id },
                            isExpert,
                            name,
                            email,
                            picture,
                        };
                    }
                    return token;
                } catch (error: unknown) {
                    console.error("Signup error:", error);
                    return token;
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    id: token.sub,
                    googleId: token.sub,
                    name: token.name,
                    email: token.email,
                    image: token.picture,
                    access: token.access,
                    userData: token.userData,
                    isExpert: token.isExpert,
                },
            };
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
