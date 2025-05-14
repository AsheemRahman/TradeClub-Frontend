import UserFooter from "@/components/user/footer";
import UserNavbar from "@/components/user/navbar";

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <UserNavbar />
            <main>{children}</main>
            <UserFooter />
        </div>
    );
}