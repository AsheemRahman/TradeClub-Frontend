import Image from "next/image";
import { ICourse, ICourseContent } from "@/types/courseTypes";
import { Clock, Star, Users } from "lucide-react";

export const CourseCard = ({ course }: { course: ICourse }) => {

    const calculateTotalDuration = (content: ICourseContent[]) => {
        return content.reduce((total, item) => total + item.duration, 0);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-48">
                <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    ${course.price}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {course.category}
                    </span>
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {/* <span className="ml-1 text-sm text-gray-600">{course.rating}</span> */}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(calculateTotalDuration(course.content))}
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {/* {course.studentsCount} students */}
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    View Course
                </button>
            </div>
        </div>
    );
};
