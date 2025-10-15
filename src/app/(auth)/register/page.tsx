'use client';

import Register from "@/components/shared/register";
import { registerPost } from "@/app/service/shared/sharedApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IRegister, RegisterPayload } from "@/types/types";
import { useAuthStore } from "@/store/authStore";
import { useExpertStore } from "@/store/expertStore";
import { useEffect } from "react";

const UserRegister = () => {
    const router = useRouter();
    const { user, token: userToken } = useAuthStore();
    const { expert, token: expertToken } = useExpertStore();

    // Redirect logic
    useEffect(() => {
        if (user && userToken) {
            router.replace("/home");
        } else if (expert && expertToken) {
            router.replace("/expert/dashboard");
        }
    }, [user, userToken, expert, expertToken, router]);

    const handleRegister = async (formData: IRegister) => {
        try {
            const payload = { ...formData, role: 'user' };
            const response = await registerPost(payload as RegisterPayload);
            if (response?.email) {
                toast.success(response.message || "Registration successful!");
                router.replace(`/verify-otp?email=${response.email}&type=register`);
            }
        } catch (err) {
            console.error("Error during user register:", err);
            toast.error("Something went wrong during registration.");
        }
    };

    return (
        <>
            <Register role="user" onRegister={handleRegister} />
        </>
    );
};

export default UserRegister;
