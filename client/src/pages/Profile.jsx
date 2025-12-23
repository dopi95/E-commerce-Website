import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';


const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name || '',
        email : user.email || '',
        mobile : user.mobile || '',
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [loading,setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name || '',
            email : user.email || '',
            mobile : user.mobile || '',
        })
    },[user])

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordSubmit = async(e) => {
        e.preventDefault()
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }
        
        try {
            setPasswordLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: { password: passwordData.newPassword }
            })

            if(response.data.success){
                toast.success('Password updated successfully')
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <div className='p-4'>

        {/**profile upload and display image */}
        <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img 
                      alt={user.name}
                      src={user.avatar}
                      className='w-full h-full'
                    />
                ) : (
                    <FaRegUserCircle size={65}/>
                )
            }
        </div>
        <button onClick={()=>setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>
        
        {
            openProfileAvatarEdit && (
                <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
            )
        }

        {/**name, mobile , email, change password */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.email}
                    name='email'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleOnChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
                {
                    loading ? "Loading..." : "Update Profile"
                }
            </button>
        </form>

        {/**Change Password Section */}
        <div className='mt-8 border-t pt-6'>
            <h3 className='text-lg font-semibold mb-4'>Change Password</h3>
            <form className='grid gap-4' onSubmit={handlePasswordSubmit}>
                <div className='grid'>
                    <label htmlFor='currentPassword'>Current Password</label>
                    <input
                        type='password'
                        id='currentPassword'
                        placeholder='Enter current password'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={passwordData.currentPassword}
                        name='currentPassword'
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className='grid'>
                    <label htmlFor='newPassword'>New Password</label>
                    <input
                        type='password'
                        id='newPassword'
                        placeholder='Enter new password'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={passwordData.newPassword}
                        name='newPassword'
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className='grid'>
                    <label htmlFor='confirmPassword'>Confirm New Password</label>
                    <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Confirm new password'
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={passwordData.confirmPassword}
                        name='confirmPassword'
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button 
                    type='submit'
                    className='border px-4 py-2 font-semibold hover:bg-red-100 border-red-200 text-red-600 hover:text-red-800 rounded'
                >
                    {
                        passwordLoading ? "Updating..." : "Change Password"
                    }
                </button>
            </form>
        </div>
    </div>
  )
}

export default Profile
