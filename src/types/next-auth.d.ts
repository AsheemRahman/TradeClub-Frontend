import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            role: 'user' | 'expert';
            isVerified?: 'Approved' | 'Pending' | 'Declined';
        };
    }

    interface User {
        id: string;
        role: 'user' | 'expert';
        isVerified?: 'Approved' | 'Pending' | 'Declined';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        user: {
            id: string;
            role: 'user' | 'expert';
            isVerified?: 'Approved' | 'Pending' | 'Declined';
        };
    }
}
