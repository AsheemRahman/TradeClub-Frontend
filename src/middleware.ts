import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './types/types';


export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const { pathname } = url;

    if (pathname.startsWith('/login') || pathname.startsWith('/admin/login') || pathname.startsWith('/expert/login')) {
        return NextResponse.next();
    }

    const token = req.cookies.get('accessToken')?.value || req.cookies.get('admin-accessToken')?.value
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const adminRefreshToken = req.cookies.get('admin-refreshToken')?.value;

    let role = null;

    if (token) {
        try {
            const decoded = jwt.decode(token) as TokenPayload | null;
            role = decoded?.role
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    console.log("middleware role =>", role);

    if ((!token && refreshToken) || (!token && adminRefreshToken)) {
        console.log("Access token expired, but refresh token exists. Allowing frontend to refresh.");
        return NextResponse.next();
    }

    if (!token) {
        if (pathname.startsWith('/expert')) {
            return NextResponse.redirect(new URL('/expert/login', req.url));
        }
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/home',
        '/profile',
        '/courses/(.*)',
        '/expert/dashboard',
        '/expert/profile',
        '/expert/profile/edit',
        '/expert/session',
        '/expert/wallet',
        '/expert/message',
        '/expert/verification',
        '/expert/verification-pending',
        '/admin/dashboard',
        '/admin/user-management',
        '/admin/expert-management',
        '/admin/expert-management/(.*)',
        '/admin/category',
        '/admin/course',
        '/admin/course/(.*)',
        '/admin/coupon',
        '/admin/wallet',
    ],
};