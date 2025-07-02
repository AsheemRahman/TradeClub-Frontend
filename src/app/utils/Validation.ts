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
    phoneNumber: {
        validate: (value: string) => {
            if (!value) return true;
            if (!/^[0-9]+$/.test(value)) return "Phone number must contain only digits";
            if (value.length < 10) return "Phone number must be at least 10 digits";
            if (value.length > 15) return "Phone number must be at most 15 digits";
            return true;
        }
    },
    checkBox: {
        required: "You must accept the terms",
    }
}

export const courseValidation = {
    title: {
        required: 'Title is required',
        minLength: { value: 3, message: 'Title must be at least 3 characters' },
    },
    price: {
        required: 'Price is required',
        valueAsNumber: true,
        min: { value: 1, message: 'Price must be greater than 0' },
    },
    description: {
        required: 'Description is required',
        minLength: { value: 10, message: 'Description must be at least 10 characters' },
    },
    category: {
        required: 'Category is required',
    },
    imageUrl: {
        required: 'Course image is required',
    },
    contentTitle: {
        required: 'Content title is required',
    },
    contentDuration: {
        required: 'Duration is required',
        valueAsNumber: true,
        min: { value: 1, message: 'Duration must be greater than 0' },
    },
    videoUrl: {
        required: 'Video URL is required',
    },
};