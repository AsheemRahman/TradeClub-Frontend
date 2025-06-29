import { HomeHero } from '@/components/user/HomeComponent';
import { SubscriptionPlans } from '@/components/user/SubscriptionList';


export default function Home() {
    return (
        <div className="font-sans">
            <HomeHero />
            <SubscriptionPlans />
        </div>
    );
}