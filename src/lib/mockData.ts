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