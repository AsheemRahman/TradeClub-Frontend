import { ICourse, ICourseProgress, IPurchasedCourse } from "@/types/courseTypes";

export const purchaseHistory = [
    {
        id: 1,
        type: 'subscription',
        productName: 'Premium Plan',
        amount: 29.99,
        status: 'completed',
        createdAt: '2025-01-15'
    },
    {
        id: 2,
        type: 'expert-consultation',
        productName: 'Expert Consultation - 1 Hour',
        amount: 99.99,
        status: 'completed',
        createdAt: '2025-02-20'
    },
    {
        id: 3,
        type: 'credits',
        productName: 'Additional Credits Pack',
        amount: 19.99,
        status: 'completed',
        createdAt: '2025-03-10'
    }
];


export const subscription = {
    type: 'free',
    status: 'active',
    endDate: '2025-12-31'
}

// Mock data based on your schema
export const mockWalletData = {
    _id: "64a7b8c9d1234567890abcde",
    expertId: "64a7b8c9d1234567890abcdf",
    balance: 2450.75,
    totalEarnings: 8950.00,
    totalWithdrawn: 6499.25,
    lastTransactionAt: new Date("2024-06-25T10:30:00Z"),
    transactions: [
        {
            orderId: "ORD-2024-001",
            amount: 150.00,
            type: "credit" as const,
            transactionDate: new Date("2024-06-25T10:30:00Z")
        },
        {
            orderId: "WD-2024-003",
            amount: 500.00,
            type: "debit" as const,
            transactionDate: new Date("2024-06-24T14:15:00Z")
        },
        {
            orderId: "ORD-2024-002",
            amount: 225.50,
            type: "credit" as const,
            transactionDate: new Date("2024-06-23T16:45:00Z")
        },
        {
            orderId: "ORD-2024-001",
            amount: 89.99,
            type: "credit" as const,
            transactionDate: new Date("2024-06-22T09:20:00Z")
        },
        {
            orderId: "WD-2024-002",
            amount: 300.00,
            type: "debit" as const,
            transactionDate: new Date("2024-06-20T11:30:00Z")
        }
    ],
    createdAt: new Date("2024-01-15T08:00:00Z"),
    updatedAt: new Date("2024-06-25T10:30:00Z")
};


// Mock data for demonstration
export const mockPurchasedCourses: IPurchasedCourse[] = [
    {
        course: {
            _id: '1',
            title: 'Complete React Development Course',
            description: 'Master React from basics to advanced concepts including hooks, context, and modern development patterns.',
            price: 99.99,
            imageUrl: 'https://tradeclub03.s3.eu-north-1.amazonaws.com/Course/1750060009627-ymgw0qt592f.jpg',
            category: "AsheemRahman",
            content: Array.from({ length: 25 }, (_, i) => ({
                _id: `content-${i + 1}`,
                title: `Lesson ${i + 1}`,
                videoUrl: `video-${i + 1}`,
                duration: 15 + Math.floor(Math.random() * 20)
            })),
            isPublished: true,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:20:00Z'
        },
        progress: {
            _id: 'progress-1',
            user: "userId",
            course: '1',
            progress: Array.from({ length: 15 }, (_, i) => ({
                contentId: `content-${i + 1}`,
                watchedDuration: 900 + Math.floor(Math.random() * 600),
                isCompleted: true,
                lastWatchedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            })),
            totalCompletedPercent: 60,
            lastWatchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: new Date().toISOString()
        },
        purchaseDate: '2024-01-15T10:30:00Z'
    },
    {
        course: {
            _id: '2',
            title: 'Advanced JavaScript Mastery',
            description: 'Deep dive into JavaScript ES6+, async programming, and modern JavaScript frameworks.',
            price: 129.99,
            imageUrl: 'https://tradeclub03.s3.eu-north-1.amazonaws.com/Course/1750060009627-ymgw0qt592f.jpg',
            category: "AsheemRahman",
            content: Array.from({ length: 30 }, (_, i) => ({
                _id: `js-content-${i + 1}`,
                title: `JavaScript Lesson ${i + 1}`,
                videoUrl: `js-video-${i + 1}`,
                duration: 20 + Math.floor(Math.random() * 15)
            })),
            isPublished: true,
            createdAt: '2024-01-10T10:30:00Z',
            updatedAt: '2024-01-18T14:20:00Z'
        },
        progress: {
            _id: 'progress-2',
            user: "userId",
            course: '2',
            progress: Array.from({ length: 30 }, (_, i) => ({
                contentId: `js-content-${i + 1}`,
                watchedDuration: 1200 + Math.floor(Math.random() * 600),
                isCompleted: true,
                lastWatchedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
            })),
            totalCompletedPercent: 100,
            lastWatchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: '2024-01-10T10:30:00Z',
            updatedAt: new Date().toISOString()
        },
        purchaseDate: '2024-01-10T10:30:00Z'
    },
    {
        course: {
            _id: '3',
            title: 'Node.js Backend Development',
            description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
            price: 89.99,
            imageUrl: 'https://tradeclub03.s3.eu-north-1.amazonaws.com/Course/1750060009627-ymgw0qt592f.jpg',
            category: "AsheemRahman",
            content: Array.from({ length: 20 }, (_, i) => ({
                _id: `node-content-${i + 1}`,
                title: `Node.js Lesson ${i + 1}`,
                videoUrl: `node-video-${i + 1}`,
                duration: 18 + Math.floor(Math.random() * 12)
            })),
            isPublished: true,
            createdAt: '2024-01-05T10:30:00Z',
            updatedAt: '2024-01-12T14:20:00Z'
        },
        progress: {
            _id: 'progress-3',
            user: "userId",
            course: '3',
            progress: Array.from({ length: 5 }, (_, i) => ({
                contentId: `node-content-${i + 1}`,
                watchedDuration: 600 + Math.floor(Math.random() * 400),
                isCompleted: i < 3,
                lastWatchedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
            })),
            totalCompletedPercent: 25,
            lastWatchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: '2024-01-05T10:30:00Z',
            updatedAt: new Date().toISOString()
        },
        purchaseDate: '2024-01-05T10:30:00Z'
    },
];



// Mock data for demonstration
export const mockCourse: ICourse = {
    _id: '1sdfsdfds',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts including hooks, context, and modern development patterns.',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category: 'asdassddsasdas',
    content: [
        {
            _id: "1",
            title: 'Introduction to React',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            duration: 15
        },
        {
            _id: "2",
            title: 'Components and JSX',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            duration: 22
        },
        {
            _id: "3",
            title: 'State and Props',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
            duration: 28
        },
        {
            _id: "4",
            title: 'Event Handling',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            duration: 18
        },
        {
            _id: "5",
            title: 'React Hooks',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            duration: 35
        }
    ],
    isPublished: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z'
};

export const mockProgress: ICourseProgress = {
    _id: 'progress1',
    user: "sdadsadas",
    course: "courseId",
    progress: [
        {
            contentId: '1',
            watchedDuration: 15,
            isCompleted: true,
            lastWatchedAt: new Date().toISOString()
        },
        {
            contentId: '2',
            watchedDuration: 10,
            isCompleted: false,
            lastWatchedAt: new Date().toISOString()
        }
    ],
    totalCompletedPercent: 20,
    lastWatchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
