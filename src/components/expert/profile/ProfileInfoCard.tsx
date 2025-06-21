
export const ProfileInfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[#151231] rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b pb-2">
            {title}
        </h3>
        {children}
    </div>
);