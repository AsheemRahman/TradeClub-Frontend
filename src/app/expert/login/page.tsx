"use client";

import Login from "@/components/shared/login";
import { LoginPost, googleSignup } from "@/app/service/shared/sharedApi";
import { toast } from "react-toastify";
import { useExpertStore } from "@/store/expertStore";
import { IGoogleLogin } from "@/types/types";
import { useCallback } from "react";


const ExpertLogin = () => {

    const { setExpertAuth } = useExpertStore();

    const handleLogin = async (formData: { email: string; password: string; role: "user" | "expert" }) => {
        try {
            const response = await LoginPost(formData);
            if (response.status) {
                const { expert, accessToken } = response.data;
                if (formData.role === "expert") {
                    setExpertAuth(expert, accessToken);
                    window.location.href = "/expert/dashboard";
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
                const { expert, accessToken } = response.data;
                if (role === "expert") {
                    setExpertAuth(expert, accessToken);
                    window.location.href = "/expert/dashboard";
                }
                toast.success(response.message);
            } else {
                toast.error(response?.message || "Google Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Google signup error:", error);
            toast.error("Error during Google authentication.");
        }
    }, [setExpertAuth]);

    return <Login role="expert" onSubmit={handleLogin} onGoogleSignup={handleGoogleSignup} />;
};

export default ExpertLogin;
