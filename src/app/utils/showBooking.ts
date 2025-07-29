import Swal from 'sweetalert2';

interface BookingConfirmationProps {
    expertName: string;
    selectedDate: string;
    selectedTime: string;
    onConfirmed: () => void;
}

export const showBookingConfirmation = ({ expertName, selectedDate, selectedTime, onConfirmed, }: BookingConfirmationProps) => {
    Swal.fire({
        title: '🎉 Booking Confirmed!',
        html: `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        ">
            <div style="
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="
                        width: 50px;
                        height: 50px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 15px;
                        font-size: 24px;
                    ">👨‍💼</div>
                    <div style="text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                            ${expertName}
                        </div>
                        <div style="font-size: 14px; opacity: 0.9;">
                            Session Booked Successfully
                        </div>
                    </div>
                </div>
                
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 15px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="display: flex; align-items: center; font-size: 14px;">
                            📅 <span style="margin-left: 8px; font-weight: 500;">${selectedDate}</span>
                        </span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: flex; align-items: center; font-size: 14px;">
                            ⏰ <span style="margin-left: 8px; font-weight: 500;">${selectedTime}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="
            background: #f8f9ff;
            border: 1px solid #e1e8ff;
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            text-align: left;
        ">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #4f46e5; margin-right: 8px;">📧</span>
                <span style="color: #374151; font-size: 14px; font-weight: 500;">
                    Confirmation Details
                </span>
            </div>
            <p style="
                color: #6b7280;
                font-size: 13px;
                margin: 0;
                line-height: 1.5;
            ">
                A confirmation email with meeting details and instructions will be sent to your registered email address shortly.
            </p>
        </div>
    `,
        icon: undefined,
        showConfirmButton: true,
        confirmButtonText: '✨ Got it!',
        confirmButtonColor: '#4f46e5',
        width: '480px',
        padding: '0 20px 20px 20px',
        background: '#ffffff',
        backdrop: `rgba(0,0,0,0)`,
        customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-2xl font-bold text-gray-800 mb-4',
            confirmButton:
                'px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
            container: 'backdrop-blur-sm',
        },
        buttonsStyling: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
            popup: 'animate__animated animate__bounceIn animate__faster',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Thank you!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                customClass: { popup: 'colored-toast' },
            });
            onConfirmed();
        }
    });
};
