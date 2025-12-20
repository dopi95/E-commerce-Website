import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const ContactAdmin = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getAllContacts
            });

            if (response.data.success) {
                setContacts(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateContactStatus = async (contactId, status) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateContactStatus,
                url: `${SummaryApi.updateContactStatus.url}/${contactId}`,
                data: { status }
            });

            if (response.data.success) {
                toast.success('Status updated successfully');
                fetchContacts();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const deleteContact = async (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const response = await Axios({
                    ...SummaryApi.deleteContact,
                    url: `${SummaryApi.deleteContact.url}/${contactId}`
                });

                if (response.data.success) {
                    toast.success('Contact deleted successfully');
                    fetchContacts();
                }
            } catch (error) {
                AxiosToastError(error);
            }
        }
    };

    const sendReply = async () => {
        if (!replyMessage.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        try {
            setSendingReply(true);
            const response = await Axios({
                ...SummaryApi.replyToContact,
                url: `${SummaryApi.replyToContact.url}/${selectedContact._id}`,
                data: { replyMessage }
            });

            if (response.data.success) {
                toast.success('Reply sent successfully!');
                setShowReplyModal(false);
                setReplyMessage('');
                fetchContacts();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setSendingReply(false);
        }
    };

    const openReplyModal = (contact) => {
        setSelectedContact(contact);
        setShowReplyModal(true);
    };

    const closeReplyModal = () => {
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedContact(null);
    };

    const openModal = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
        if (contact.status === 'new') {
            updateContactStatus(contact._id, 'read');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800';
            case 'read': return 'bg-yellow-100 text-yellow-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
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
        fetchContacts();
    }, []);

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Contact Messages</h1>
                <div className='flex gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                        <span className='w-3 h-3 bg-red-500 rounded-full'></span>
                        <span>New ({contacts.filter(c => c.status === 'new').length})</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='w-3 h-3 bg-yellow-500 rounded-full'></span>
                        <span>Read ({contacts.filter(c => c.status === 'read').length})</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                        <span>Replied ({contacts.filter(c => c.status === 'replied').length})</span>
                    </div>
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
                                        Contact Info
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Subject
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Date
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {contacts.map((contact) => (
                                    <tr key={contact._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div>
                                                <div className='text-sm font-medium text-gray-900'>{contact.name}</div>
                                                <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                    <FaEnvelope size={12} />
                                                    {contact.email}
                                                </div>
                                                <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                    <FaPhone size={12} />
                                                    {contact.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm text-gray-900'>{contact.subject}</div>
                                            <div className='text-sm text-gray-500 truncate max-w-xs'>
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            <div className='flex items-center gap-1'>
                                                <FaCalendarAlt size={12} />
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => openModal(contact)}
                                                    className='text-blue-600 hover:text-blue-900 p-1'
                                                    title='View Details'
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => openReplyModal(contact)}
                                                    className='text-green-600 hover:text-green-900 p-1'
                                                    title='Reply via Email'
                                                >
                                                    <FaEnvelope />
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(contact._id)}
                                                    className='text-red-600 hover:text-red-900 p-1'
                                                    title='Delete'
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {contacts.length === 0 && (
                        <div className='text-center py-12'>
                            <FaEnvelope className='mx-auto h-12 w-12 text-gray-400' />
                            <h3 className='mt-2 text-sm font-medium text-gray-900'>No contacts</h3>
                            <p className='mt-1 text-sm text-gray-500'>No contact messages have been received yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* View Details Modal */}
            {showModal && selectedContact && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <h2 className='text-xl font-bold text-gray-800'>Contact Details</h2>
                                <button
                                    onClick={closeModal}
                                    className='text-gray-400 hover:text-gray-600'
                                >
                                    ✕
                                </button>
                            </div>

                            <div className='space-y-4'>
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                                        <p className='mt-1 text-sm text-gray-900'>{selectedContact.name}</p>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Email</label>
                                        <p className='mt-1 text-sm text-gray-900'>{selectedContact.email}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Phone</label>
                                        <p className='mt-1 text-sm text-gray-900'>{selectedContact.phone}</p>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Subject</label>
                                        <p className='mt-1 text-sm text-gray-900'>{selectedContact.subject}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Message</label>
                                    <div className='mt-1 p-3 bg-gray-50 rounded-md'>
                                        <p className='text-sm text-gray-900 whitespace-pre-wrap'>{selectedContact.message}</p>
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Status</label>
                                        <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedContact.status)}`}>
                                            {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Received</label>
                                        <p className='mt-1 text-sm text-gray-900'>{formatDate(selectedContact.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 flex justify-end gap-3'>
                                <button
                                    onClick={closeModal}
                                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        closeModal();
                                        openReplyModal(selectedContact);
                                    }}
                                    className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
                                >
                                    Reply via Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && selectedContact && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <h2 className='text-xl font-bold text-gray-800'>Reply to {selectedContact.name}</h2>
                                <button
                                    onClick={closeReplyModal}
                                    className='text-gray-400 hover:text-gray-600'
                                >
                                    ✕
                                </button>
                            </div>

                            <div className='space-y-4'>
                                <div className='bg-gray-50 p-4 rounded-md'>
                                    <h3 className='font-medium text-gray-700 mb-2'>Original Message:</h3>
                                    <p className='text-sm text-gray-600'><strong>Subject:</strong> {selectedContact.subject}</p>
                                    <p className='text-sm text-gray-900 mt-2 whitespace-pre-wrap'>{selectedContact.message}</p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Your Reply *
                                    </label>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        rows={8}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
                                        placeholder='Type your reply here...'
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className='mt-6 flex justify-end gap-3'>
                                <button
                                    onClick={closeReplyModal}
                                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                                    disabled={sendingReply}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendReply}
                                    disabled={sendingReply || !replyMessage.trim()}
                                    className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {sendingReply ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactAdmin;