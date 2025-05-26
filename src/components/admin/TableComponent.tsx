import { UserType } from "@/types/types";
import Swal from 'sweetalert2'
import { Eye } from 'lucide-react';
import { useRouter } from "next/navigation";



interface Props {
    userData: UserType[];
    toggleStatus: (id: string, status: boolean) => void;
    role: string
}

export default function TableComponent({ userData, toggleStatus, role }: Props) {

    const router = useRouter();

    const handlePermission = (id: string, isActive: boolean) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then((result) => {
            if (result.isConfirmed) {
                toggleStatus(id, isActive)
            }
        });
    }


    const handleVerification = (id: string) => {
        router.push(`/admin/expert-management/${id}`)
    }


    return (
        <div className=" bg-[#151231] p-4 rounded-xl shadow-md mx-auto mt-5">
            <table className="w-full border-separate border-spacing-y-4 text-[1em]">
                <thead className="hidden md:table-header-group bg-[#090719] text-[#fefeeb]">
                    <tr>
                        <th className="py-4 px-4 rounded-l-xl">SL.No</th>
                        <th className="py-4 px-4">Name</th>
                        <th className="py-4 px-4">Email</th>
                        <th className="py-4 px-4">Phone</th>
                        <th className="py-4 px-4">Status</th>
                        {role == "expert" && <th className="py-3 px-4">Verification</th>}
                        <th className="py-3 px-4">Action</th>
                        {role == "expert" && <th className="py-3 px-4 rounded-r-xl">Details</th>}
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user: UserType, index: number) => (
                        <tr key={user.id} className="text-[#fefeeb] md:rounded-xl md:table-row block mb-4 md:mb-0">
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['SL.No'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {index + 1}
                            </td>
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['Name'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.fullName}
                            </td>
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['Email'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.email}
                            </td>
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['Phone'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.phoneNumber}
                            </td>
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['Status'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {role == "user" ?
                                    <span className={user.isActive ? 'text-green-500' : 'text-red-500'}>
                                        {user.isActive == true ? 'Active' : 'Blocked'}
                                    </span> :
                                    <span className={user.isActive ? 'text-green-500' : 'text-red-500'}>
                                        {user.isActive == true ? 'Active' : 'Blocked'}
                                    </span>
                                }
                            </td>
                            {role == "expert" && <td className="py-3 px-4 md:text-center text-right relative before:content-['Verification'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                <span className={user.isVerified == "Approved" ? 'text-green-500' : 'text-red-500'}>
                                    {user.isVerified}
                                </span>
                            </td>}
                            <td className="py-3 px-4 md:text-center text-right relative before:content-['Action'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                <button onClick={() => handlePermission(user.id, !user.isActive)} className={user.isActive ? 'text-green-500 hover:opacity-60' : 'text-red-500 hover:opacity-60'}>
                                    {user.isActive ? (
                                        <i className="bi bi-x-circle"></i>
                                    ) : (
                                        <i className="bi bi-check-circle"></i>
                                    )}
                                </button>
                            </td>
                            {role == "expert" && <td className="py-3 px-4 md:text-center text-right relative before:content-['Details'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                <button onClick={() => handleVerification(user.id)} className="text-red-500 flex gap-2 hover:opacity-60">
                                    <Eye /> View
                                </button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
