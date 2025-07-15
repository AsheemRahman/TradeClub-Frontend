import Image from "next/image";
import { ICategory, ICourse, ICourseContent } from "@/types/courseTypes";
import { Clock, Star, Users } from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handlePurchase } from "@/app/service/user/userApi";

type Props = {
    course: ICourse;
    categories: ICategory[];
};

export const CourseCard = ({ course, categories }: Props) => {
    const { user } = useAuthStore();
    const router = useRouter()

    const calculateTotalDuration = (content: ICourseContent[]) => {
        return content.reduce((total, item) => total + item.duration, 0);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const handleBuy = () => {
        if (user) {
            handlePurchase(course)
        } else {
            router.push('/login')
            toast.error("Login to buy course")
        }
    }

    const handleViewDetails = () => {
        router.push(`/courses/${course._id}`);
    };

    return (
        <div className="bg-[#151231] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="relative w-full h-48 flex-shrink-0">
                <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    ${course.price}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {categories.find(cat => course?.category === cat._id)?.categoryName || 'Unknown'}
                    </span>
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {/* <span className="ml-1 text-sm text-gray-600">{course.rating || 0}</span> */}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(calculateTotalDuration(course.content))}
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.purchasedUsers || 0} users
                    </div>
                </div>
                <div className="flex gap-2 mt-auto">
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition" onClick={handleViewDetails}>
                        View Details
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition" onClick={handleBuy}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};