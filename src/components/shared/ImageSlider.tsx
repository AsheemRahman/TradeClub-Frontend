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
        </div>
    );
};

export default ImageSlider;
