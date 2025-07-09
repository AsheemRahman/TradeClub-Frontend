import { RetroGrid } from '@/components/magicui/retro-grid';
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity';
import { HomeHero } from '@/components/user/HomeComponent';
import { SubscriptionPlans } from '@/components/user/SubscriptionList';


export default function Home() {
    return (
        <>
            <div className="font-sans relative w-full overflow-hidden">
                <RetroGrid />
                <HomeHero />
            </div>
            <VelocityScroll>Crypto Forex Stock </VelocityScroll>
            <SubscriptionPlans />
        </>
    );
}