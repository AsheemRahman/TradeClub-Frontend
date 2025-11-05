"use client";

import Login from "@/components/shared/login";
import { LoginPost, googleSignup } from "@/app/service/shared/sharedApi";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { IGoogleLogin } from "@/types/types";
import { useCallback, useEffect } from "react";

const UserLogin = () => {
    const { setUserAuth, user, token: userToken } = useAuthStore();

    // Redirect logic
    useEffect(() => {
        if (user && userToken) {
            window.location.href = "/home";
        }
    }, [user, userToken]);

    // handle normal login
    const handleLogin = async (formData: { email: string; password: string; role: "user" | "expert" }) => {
        try {
            const response = await LoginPost(formData);
            if (response.status) {
                const { user, accessToken } = response.data;
                if (formData.role === "user") {
                    setUserAuth(user, accessToken);
                    window.location.href = "/home";
                }
                toast.success(response.message);
            } else {
                toast.error(response?.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login.");
        }
    };

    // handle Google login backend communication
    const handleGoogleSignup = useCallback(async (userData: IGoogleLogin, role: "user" | "expert") => {
        try {
            const response = await googleSignup(userData);
            if (response.status) {
                const { user, accessToken } = response.data;
                if (role === "user") {
                    setUserAuth(user, accessToken);
                    window.location.href = "/home";
                }
                toast.success(response.message);
            } else {
                toast.error(response?.message || "Google Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Google signup error:", error);
            toast.error("Error during Google authentication.");
        }
    }, [setUserAuth]);

    if (userToken) return null;

    return <Login role="user" onSubmit={handleLogin} onGoogleSignup={handleGoogleSignup} />;
};

export default UserLogin;
