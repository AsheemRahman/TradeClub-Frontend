// utils/validation.ts

export const registerValidation = {
    fullName: {
        required: "Full name is required",
        minLength: {
            value: 4,
            message: "Full name must be at least 4 characters",
        },
    },
    email: {
        required: "Email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
        },
    },
    password: {
        required: "Password is required",
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
            message:
                "Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long",
        },
    },
    confirmPassword: {
        required: "Please confirm your password",
    },
};
