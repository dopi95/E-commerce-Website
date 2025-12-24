import React, { useState, useEffect } from 'react';
import { FaTrash, FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const columnHelper = createColumnHelper();

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

    const columns = [
        columnHelper.accessor('name', {
            header: 'User Info',
            cell: ({ row }) => (
                <div className='flex items-center'>
                    <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3'>
                        <FaUser className='text-green-600 text-sm' />
                    </div>
                    <div>
                        <div className='text-sm font-medium'>{row.original.name}</div>
                        <div className='text-xs text-gray-500'>ID: {row.original._id}</div>
                    </div>
                </div>
            )
        }),
        columnHelper.accessor('email', {
            header: 'Contact',
            cell: ({ row }) => (
                <div>
                    <div className='text-sm flex items-center gap-1'>
                        <FaEnvelope size={10} />
                        {row.original.email}
                    </div>
                    {row.original.mobile && (
                        <div className='text-xs text-gray-500 flex items-center gap-1'>
                            <FaPhone size={10} />
                            {row.original.mobile}
                        </div>
                    )}
                </div>
            )
        }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: ({ row }) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    row.original.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {row.original.role}
                </span>
            )
        }),
        columnHelper.accessor('createdAt', {
            header: 'Registered',
            cell: ({ row }) => (
                <div className='text-sm flex items-center gap-1'>
                    <FaCalendarAlt size={10} />
                    {formatDate(row.original.createdAt)}
                </div>
            )
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: ({ row }) => (
                <div>
                    {row.original.role !== 'ADMIN' && (
                        <button
                            onClick={() => deleteUser(row.original._id)}
                            className='p-2 bg-red-100 rounded-full text-red-600 hover:text-red-800'
                            title='Delete User'
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                </div>
            )
        })
    ];

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
                <div className='overflow-auto w-full max-w-[95vw]'>
                    <DisplayTable
                        data={users}
                        column={columns}
                    />
                </div>
            )}
        </div>
    );
};

export default UsersAdmin;