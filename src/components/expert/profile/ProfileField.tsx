export const ProfileField: React.FC<{ label: string; value?: string; placeholder?: string; icon?: React.ReactNode; }> = ({ label, value, placeholder = "Not provided", icon }) => (
    <div className="flex items-start space-x-3 py-2">
        {icon && (
            <div className="text-gray-300 mt-1">
                {icon}
            </div>
        )}
        <div className="flex-1 min-w-0">
            <dt className="text-sm font-medium text-gray-200">{label}</dt>
            <dd className="text-sm text-gray-400 mt-1">
                {value || <span className="text-gray-400 italic">{placeholder}</span>}
            </dd>
        </div>
    </div>
);