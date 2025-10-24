import { registerPost } from "@/app/service/shared/sharedApi";
import Register from "@/components/shared/register";
import { useExpertStore } from "@/store/expertStore";
import { IRegister, RegisterPayload } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";


const ExpertRegister = () => {
    const router = useRouter();
    const { expert, token: expertToken } = useExpertStore();

    // Redirect logic
    useEffect(() => {
        if (expert && expertToken) {
            router.replace("/expert/dashboard");
        }
    }, [expert, expertToken, router]);

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
    return <>
        <Register role='expert' onRegister={handleRegister} />
    </>
};

export default ExpertRegister;