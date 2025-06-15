import { MessageCircle } from 'lucide-react';


const expertConsultation = {
    availableSlots: 3,
    usedSlots: 2,
    totalSlots: 5
}


const ExpertConsultationCard = () => {
    const { availableSlots, usedSlots, totalSlots } = expertConsultation;

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Expert Consultation Slots
            </h3>

            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                    <p className="text-3xl font-bold text-blue-400 mb-2">{availableSlots}</p>
                    <p className="text-slate-400">Available</p>
                </div>
                <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                    <p className="text-3xl font-bold text-slate-400 mb-2">{usedSlots}</p>
                    <p className="text-slate-400">Used</p>
                </div>
                <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                    <p className="text-3xl font-bold text-green-400 mb-2">{totalSlots}</p>
                    <p className="text-slate-400">Total</p>
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl hover:from-green-400 hover:to-teal-400 transition-all duration-200 font-medium shadow-lg">
                Book Expert Consultation
            </button>
        </div>
    );
};

export default ExpertConsultationCard;
