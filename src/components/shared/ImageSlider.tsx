import { useEffect, useState } from "react";
import Image from "next/image";

const ImageSlider = () => {
    const images = [
        "/images/user-login.jpg",
        "/images/user-login1.jpg",
        "/images/user-login2.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex justify-center items-center ml-6 w-full h-[500px]">
            <Image src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} width={550} height={500} className="rounded-lg object-cover w-full h-full" />
            {/* Dots at the bottom */}
            <div className="absolute bottom-28 flex space-x-2">
                <div className="w-6 h-1 bg-white rounded-full"></div>
                <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
            </div>
        </div>
    );
};

export default ImageSlider;
