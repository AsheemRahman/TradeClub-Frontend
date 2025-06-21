
// Status Badge

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};


// Experience Level Badge Component

export const ExperienceBadge: React.FC<{ level: string }> = ({ level }) => {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Expert':
                return 'bg-purple-100 text-purple-800';
            case 'Intermediate':
                return 'bg-blue-100 text-blue-800';
            case 'Beginner':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getLevelColor(level)}`}>
            {level}
        </span>
    );
};