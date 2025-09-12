import { useState, useEffect } from 'react';

const NotificationToast = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-red-500 bg-red-50';
            case 'medium':
                return 'border-yellow-500 bg-yellow-50';
            case 'low':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-blue-500 bg-blue-50';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 ${getPriorityColor(notification.priority)} p-4`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                        </p>
                    </div>
                    <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;