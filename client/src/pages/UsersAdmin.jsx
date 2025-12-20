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
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Registered Users</h1>
                <div className='text-sm text-gray-600'>
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
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        User Info
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Contact
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Role
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Registered
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {users.map((user) => (
                                    <tr key={user._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                                                        <FaUser className='text-green-600' />
                                                    </div>
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                                                    <div className='text-sm text-gray-500'>ID: {user._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 flex items-center gap-1'>
                                                <FaEnvelope size={12} />
                                                {user.email}
                                            </div>
                                            {user.mobile && (
                                                <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                    <FaPhone size={12} />
                                                    {user.mobile}
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'ADMIN' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            <div className='flex items-center gap-1'>
                                                <FaCalendarAlt size={12} />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className='text-red-600 hover:text-red-900 p-1'
                                                    title='Delete User'
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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