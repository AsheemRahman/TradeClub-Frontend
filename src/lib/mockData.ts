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

// Mock data for demonstration
export const mockCoupons = [
    {
        _id: '1',
        code: 'WELCOME20',
        description: 'Welcome discount for new users',
        discountType: 'percentage',
        discountValue: 20,
        minPurchaseAmount: 50,
        usageLimit: 1000,
        usedCount: 234,
        expiresAt: new Date('2025-12-31'),
        isActive: true,
        target: 'new_joiners',
        createdAt: new Date('2025-01-15')
    },
    {
        _id: '2',
        code: 'SAVE50',
        description: 'Fixed $50 discount',
        discountType: 'fixed',
        discountValue: 50,
        minPurchaseAmount: 200,
        usageLimit: 500,
        usedCount: 89,
        expiresAt: new Date('2025-08-15'),
        isActive: true,
        target: 'all',
        createdAt: new Date('2025-02-01')
    },
    {
        _id: '3',
        code: 'PREMIUM10',
        description: 'Premium users special offer',
        discountType: 'percentage',
        discountValue: 10,
        usageLimit: 200,
        usedCount: 156,
        expiresAt: new Date('2025-07-01'),
        isActive: false,
        target: 'premium_users',
        createdAt: new Date('2025-01-10')
    }
];