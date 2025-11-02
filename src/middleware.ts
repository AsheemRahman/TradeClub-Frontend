import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './types/types';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const { pathname } = url;

    // Redirect non-www to www for consistent cookie access
    if (req.nextUrl.hostname === 'tradeclub.lol') {
        const redirectUrl = new URL(req.url);
        redirectUrl.hostname = 'www.tradeclub.lol';
        return NextResponse.redirect(redirectUrl);
    }

    // Allow login pages
    if (pathname.startsWith('/login') || pathname.startsWith('/admin/login') || pathname.startsWith('/expert/login')) {
        return NextResponse.next();
    }

    // Get tokens from cookies
    const accessToken = req.cookies.get('accessToken')?.value || req.cookies.get('admin-accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const adminRefreshToken = req.cookies.get('admin-refreshToken')?.value;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Admin Refresh Token:', adminRefreshToken);

    // Decode token to get role
    let role: string | null = null;
    if (accessToken) {
        try {
            const decoded = jwt.decode(accessToken) as TokenPayload | null;
            role = decoded?.role || null;
        } catch (err) {
            console.error('Token decode error:', err);
        }
    }
    console.log('middleware role =>', role);

    // If no access token but refresh token exists, allow frontend to refresh
    if (!accessToken && (refreshToken || adminRefreshToken)) {
        console.log('Access token missing, but refresh token exists. Frontend can refresh.');
        return NextResponse.next();
    }

    // If no tokens, redirect to login based on route
    if (!accessToken) {
        if (pathname.startsWith('/expert')) {
            return NextResponse.redirect(new URL('/expert/login', req.url));
        }
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (pathname.startsWith('/expert') && role !== 'expert') {
        return NextResponse.redirect(new URL('/expert/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/home',
        '/profile',
        '/my-learning',
        '/my-learning/(.*)',
        '/consultation',
        '/consultation/(.*)',
        '/message',
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