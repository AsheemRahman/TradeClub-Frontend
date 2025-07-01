import React from "react";

interface ScheduleCardProps {
    title: string;
    description: string;
    Icon: React.ElementType;
}

const HeaderCard: React.FC<ScheduleCardProps> = ({ title, description, Icon }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5 mb-4">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between my-3">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{title}</h1>
                            <p className="text-white/80 text-lg">{description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
    );
};

export default HeaderCard;
