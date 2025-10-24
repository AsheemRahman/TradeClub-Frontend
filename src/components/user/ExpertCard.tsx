import Image from "next/image";
import { useRouter } from "next/navigation";
import { Award, BarChart3, Calendar, Clock, DollarSign, MapPin, MessageCircle, Shield, TrendingUp } from "lucide-react";
import { IExpert } from "@/types/bookingTypes";


export const ExpertCard = ({ expert }: { expert: IExpert }) => {
    const router = useRouter()

    const getMarketIcon = (market: string) => {
        switch (market) {
            case 'Stock': return <TrendingUp className="w-4 h-4" />;
            case 'Forex': return <DollarSign className="w-4 h-4" />;
            case 'Crypto': return <BarChart3 className="w-4 h-4" />;
            case 'Commodities': return <BarChart3 className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    const getExperienceBadgeColor = (level: string) => {
        switch (level) {
            case 'Expert': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleBookSlot = (expertId?: string) => {
        if (!expertId) return;
        router.push(`/consultation/${expertId}`)
    }

    const handleChat = (expertId?: string) => {
        if (!expertId) return;
        router.push(`/message?expertId=${expertId}`);
    };

    return (
        <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
            <div className="flex items-start gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {expert.profilePicture ? (
                            <Image src={expert.profilePicture} fill alt={expert.fullName} className="w-full h-full object-cover" />
                        ) : (
                            expert.fullName.split(' ').map(n => n[0]).join('')
                        )}
                    </div>
                    {expert.isVerified === 'Approved' && (
                        <div className="absolute -top-2 -left-2 bg-blue-600 rounded-full p-1">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{expert.fullName}</h3>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getExperienceBadgeColor(expert.experience_level || "unavaible")}`}>
                                <Award className="w-3 h-3" />
                                {expert.experience_level} Trader
                            </div>
                        </div>
                        <div className="text-right text-md text-green-600">
                            {expert.year_of_experience}+ years exp
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-xl">
                            {getMarketIcon(expert.markets_Traded || 'unavaible')}
                            <span className="text-sm font-medium text-blue-700">{expert.markets_Traded}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{expert.trading_style}</span>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(expert.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="font-bold text-gray-900">{expert.rating}</span>
                            <span className="text-gray-500 text-sm">({expert.reviews} reviews)</span>
                        </div>
                    </div> */}

                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">{expert.bio}</p>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{expert.state}, {expert.country}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { handleBookSlot(expert._id) }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                            <Calendar className="w-4 h-4" />
                            Book Session
                        </button>
                        <button onClick={() => { handleChat(expert._id) }}
                            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}