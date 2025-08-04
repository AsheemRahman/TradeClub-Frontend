import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { IOrder } from '@/types/types';
import { getPurchase } from '@/app/service/user/orderApi';

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await getPurchase();
                if (response.status) {
                    setPurchases(response.purchases || []);
                } else {
                    setPurchases([]);
                }
            } catch (error) {
                toast.error('Failed to load purchase history');
                console.error('Purchase fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    if (loading) return <p className="text-white">Loading purchase history...</p>;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPurchases = purchases.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(purchases.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                </div>
                Purchase History
            </h3>

            <div className="space-y-4 w-full">
                {currentPurchases.length > 0 ? (
                    currentPurchases.map((purchase) => (
                        <div key={purchase._id || purchase.id}
                            className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200 w-full"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-white text-lg">{purchase.title}</h4>
                                    <p className="text-slate-400 capitalize mb-1">
                                        {purchase.type.replace('-', ' ')}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                        {new Date(purchase.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white text-xl mb-4">${purchase.amount}</p>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-lg font-medium ${purchase.paymentStatus === 'paid'
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                            }`}
                                    >
                                        {purchase.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400">No purchases found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {purchases.length > itemsPerPage && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-slate-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
