import React, { useState, useEffect } from 'react';
import { FaTrash, FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getAllUsers
            });

            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await Axios({
                    ...SummaryApi.deleteUser,
                    url: `${SummaryApi.deleteUser.url}/${userId}`
                });

                if (response.data.success) {
                    toast.success('User deleted successfully');
                    fetchUsers();
                }
            } catch (error) {
                AxiosToastError(error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='w-full max-w-full'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4'>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>Registered Users</h1>
                <div className='text-xs sm:text-sm text-gray-600'>
                    Total Users: {users.length}
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <div className='min-w-[700px]'>
                            <table className='w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            User Info
                                        </th>
                                        <th className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Contact
                                        </th>
                                        <th className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Role
                                        </th>
                                        <th className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Registered
                                        </th>
                                        <th className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {users.map((user) => (
                                        <tr key={user._id} className='hover:bg-gray-50'>
                                            <td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center'>
                                                    <div className='flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10'>
                                                        <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center'>
                                                            <FaUser className='text-green-600 text-xs sm:text-sm' />
                                                        </div>
                                                    </div>
                                                    <div className='ml-3 sm:ml-4 min-w-0 flex-1'>
                                                        <div className='text-xs sm:text-sm font-medium text-gray-900 truncate'>{user.name}</div>
                                                        <div className='text-xs text-gray-500 truncate'>ID: {user._id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                                                <div className='text-xs sm:text-sm text-gray-900 flex items-center gap-1 truncate max-w-[150px]'>
                                                    <FaEnvelope size={10} />
                                                    <span className='truncate'>{user.email}</span>
                                                </div>
                                                {user.mobile && (
                                                    <div className='text-xs text-gray-500 flex items-center gap-1'>
                                                        <FaPhone size={10} />
                                                        {user.mobile}
                                                    </div>
                                                )}
                                            </td>
                                            <td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'ADMIN' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className='px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500'>
                                                <div className='flex items-center gap-1'>
                                                    <FaCalendarAlt size={10} />
                                                    <span className='truncate'>{formatDate(user.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className='px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => deleteUser(user._id)}
                                                        className='text-red-600 hover:text-red-900 p-1'
                                                        title='Delete User'
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {users.length === 0 && (
                        <div className='text-center py-12'>
                            <FaUser className='mx-auto h-12 w-12 text-gray-400' />
                            <h3 className='mt-2 text-sm font-medium text-gray-900'>No users</h3>
                            <p className='mt-1 text-sm text-gray-500'>No users have registered yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UsersAdmin;