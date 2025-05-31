// components/AchievementsCard.tsx
import { Award } from "lucide-react";

const achievements = [
    { label: "Profile Completed", color: "bg-yellow-400" },
    { label: "First Purchase", color: "bg-blue-400" },
    { label: "Expert Session Booked", color: "bg-purple-400" },
];

const AchievementsCard = () => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
            </h3>
            <div className="space-y-3">
                {achievements.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-700/30 p-3 rounded-lg"
                    >
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-slate-300 text-sm">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsCard;
