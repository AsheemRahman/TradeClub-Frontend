import { UserType } from "@/types/types";


interface Props {
    userData: UserType[];
    toggleStatus: (id: string, status: boolean) => void;
}

export default function TableComponent({ userData, toggleStatus }: Props) {
    return (
        <div className=" bg-[#151231] p-4 rounded-xl shadow-md mx-auto mt-5">
            <table className="w-full border-separate border-spacing-y-4 text-[1em]">
                <thead className="hidden md:table-header-group bg-[#090719] text-[#fefeeb]">
                    <tr>
                        <th className="py-3 px-4 rounded-l-xl">SL.No</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 rounded-r-xl">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user: UserType, index: number) => (
                        <tr key={user.id} className="text-[#fefeeb] md:rounded-xl md:table-row block mb-4 md:mb-0">
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['SL.No'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {index + 1}
                            </td>
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['Name'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.fullName}
                            </td>
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['Email'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.email}
                            </td>
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['Phone'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                {user.phoneNumber}
                            </td>
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['Status'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                <span className={user.isActive ? 'text-green-500' : 'text-red-500'}>
                                    {user.isActive == true ? 'Active' : 'Blocked'}
                                </span>
                            </td>
                            <td className="py-3 px-4 md:text-left text-right relative before:content-['Action'] md:before:hidden before:absolute before:left-4 before:font-bold">
                                <button onClick={() => toggleStatus(user.id, !user.isActive)} className="text-red-500 hover:opacity-80">
                                    {user.isActive ? (
                                        <i className="bi bi-x-circle"></i>
                                    ) : (
                                        <i className="bi bi-check-circle"></i>
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
