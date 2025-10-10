"use client";

import Login from "@/components/shared/login";
import { LoginPost, googleSignup } from "@/app/service/shared/sharedApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useExpertStore } from "@/store/expertStore";
import { IGoogleLogin } from "@/types/types";
import { useCallback } from "react";

const UserLogin = () => {
    const router = useRouter();
    const { setUserAuth } = useAuthStore();
    const { setExpertAuth } = useExpertStore();

    // handle normal login
    const handleLogin = async (formData: { email: string; password: string; role: "user" | "expert" }) => {
        try {
            const response = await LoginPost(formData);
            if (response.status) {
                const { user, expert, accessToken } = response.data;
                if (formData.role === "user") {
                    setUserAuth(user, accessToken);
                    router.replace("/home");
                } else {
                    setExpertAuth(expert, accessToken);
                    router.replace("/expert/dashboard");
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
                const { user, expert, accessToken } = response.data;
                if (role === "user") {
                    setUserAuth(user, accessToken);
                    router.replace("/home");
                } else {
                    setExpertAuth(expert, accessToken);
                    router.replace("/expert/dashboard");
                }
                toast.success(response.message);
            } else {
                toast.error(response?.message || "Google Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Google signup error:", error);
            toast.error("Error during Google authentication.");
        }
    }, [setUserAuth, setExpertAuth, router]);

    return <Login role="user" onSubmit={handleLogin} onGoogleSignup={handleGoogleSignup} />;
};

export default UserLogin;
