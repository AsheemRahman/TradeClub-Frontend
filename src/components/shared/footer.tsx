import { useState } from "react";
import { PrivacyModal } from "./PolicyModal";
import { TermsModal } from "./TermsModal";


export default function Footer() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#151231] text-gray-300 mt-4 py-6 px-6">
            <div className="container mx-auto flex justify-between items-center text-sm">
                <div className='opacity-70 ml-10'>
                    &copy; {currentYear} TradeClub. All Rights Reserved.
                </div>
                <div className="space-x-4 mr-20 " >
                    <button className=" opacity-70 hover:text-[#E54B00] cursor-pointer" onClick={() => setIsTermsOpen(true)}>
                        Terms Condition
                    </button>
                    <button className="opacity-70 hover:text-[#E54B00] cursor-pointer" onClick={() => setIsPrivacyOpen(true)}>
                        Privacy Policy
                    </button>
                </div>
            </div>
            {/* Modals */}
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        </footer>
    );
}