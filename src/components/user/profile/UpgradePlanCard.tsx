import { Star } from 'lucide-react';


const UpgradePlanCard = () => {

    return (
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Upgrade Your Plan
                </h3>
                <p className="text-blue-100 mb-4">
                    Get access to expert consultations and premium features.
                </p>
                <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 border border-white/20">
                    View Plans
                </button>
            </div>
        </div>
    );
};

export default UpgradePlanCard;
