import Image from "next/image";
import { Clock, Star, Users } from "lucide-react";
import { ICategory, ICourse, ICourseContent } from "@/types/courseTypes";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


type Props = {
    course: ICourse;
    categories: ICategory[];
    onPurchase: () => void;
};

export const CourseListItem = ({ course, categories, onPurchase }: Props) => {
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
            onPurchase()
        } else {
            router.push('/login')
            toast.error("Login to buy course")
        }
    }

    return (
        <div className="bg-[#151231] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="flex">
                <div className="relative w-58  flex-shrink-0">
                    <Image src={course.imageUrl} alt={course.title} fill className="object-center rounded-l-lg" />
                </div>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {categories.find(cat => course?.category === cat._id)?.categoryName || 'Unknown'}
                            </span>
                            <h3 className="text-xl text-white font-semibold mt-2">{course.title}</h3>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 mb-3">${course.price}</div>
                            <div className="flex items-center ">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {/* <span className="ml-1 text-sm text-gray-600">{course.rating || 0}</span> */}
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDuration(calculateTotalDuration(course.content))}
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {/* {course.studentsCount} students */}
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors" onClick={handleBuy}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}