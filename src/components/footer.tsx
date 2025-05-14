import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#151231] text-gray-300 mt-4 py-6 px-6">
            <div className="container mx-auto flex justify-between items-center text-sm">
                <div className='opacity-70 ml-10'>
                    &copy; {currentYear} TradeClub. All Rights Reserved.
                </div>
                <div className="space-x-4 mr-20 ">
                    <Link href="/terms" className=" opacity-70 hover:text-[#E54B00]">
                        Terms Condition
                    </Link>
                    <Link href="/policy" className="opacity-70 hover:text-[#E54B00]">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}