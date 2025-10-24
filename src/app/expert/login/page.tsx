"use client";

import Login from "@/components/shared/login";
import { LoginPost, googleSignup } from "@/app/service/shared/sharedApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useExpertStore } from "@/store/expertStore";
import { useAuthStore } from "@/store/authStore";
import { IGoogleLogin } from "@/types/types";
import { useCallback } from "react";

const ExpertLogin = () => {
    const router = useRouter();
    const { setExpertAuth } = useExpertStore();
    const { setUserAuth } = useAuthStore();

    const handleLogin = async (formData: { email: string; password: string; role: "user" | "expert" }) => {
        try {
            const response = await LoginPost(formData);
            if (response.status) {
                const { user, expert, accessToken } = response.data;
                if (formData.role === "expert") {
                    setExpertAuth(expert, accessToken);
                    router.replace("/expert/dashboard");
                } else {
                    setUserAuth(user, accessToken);
                    router.replace("/home");
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

    // Google signup handler
    const handleGoogleSignup = useCallback(async (userData: IGoogleLogin, role: "user" | "expert") => {
        try {
            const response = await googleSignup(userData);
            if (response.status) {
                const { user, expert, accessToken } = response.data;
                if (role === "expert") {
                    setExpertAuth(expert, accessToken);
                    router.replace("/expert/dashboard");
                } else {
                    setUserAuth(user, accessToken);
                    router.replace("/home");
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

    return <Login role="expert" onSubmit={handleLogin} onGoogleSignup={handleGoogleSignup} />;
};

export default ExpertLogin;
