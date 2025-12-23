import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const EmailVerification = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timer, setTimer] = useState(0)
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    const email = location?.state?.email

    useEffect(() => {
        if (!email) {
            navigate("/register")
        }
    }, [email, navigate])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRef.current[index - 1].focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const otpValue = otp.join("")
        if (otpValue.length !== 6) {
            toast.error("Please enter complete OTP")
            return
        }

        setIsLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.verifyEmail,
                data: {
                    email: email,
                    otp: otpValue
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setOtp(["", "", "", "", "", ""])
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (timer > 0) return

        setIsResending(true)
        try {
            const response = await Axios({
                ...SummaryApi.resendOtp,
                data: { email: email }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setTimer(60) // 60 seconds cooldown
                setOtp(["", "", "", "", "", ""])
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsResending(false)
        }
    }

    const isValidOtp = otp.every(digit => digit !== "")

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-semibold text-gray-800'>Verify Your Email</h2>
                    <p className='text-gray-600 mt-2'>
                        We've sent a 6-digit verification code to
                    </p>
                    <p className='font-semibold text-green-600'>{email}</p>
                </div>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label className='text-center text-gray-700 font-medium'>
                            Enter Verification Code
                        </label>
                        <div className='flex items-center gap-2 justify-center mt-3'>
                            {otp.map((digit, index) => (
                                <input
                                    key={`otp-${index}`}
                                    type='text'
                                    ref={(ref) => {
                                        inputRef.current[index] = ref
                                        return ref
                                    }}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    maxLength={1}
                                    className='bg-blue-50 w-12 h-12 p-2 border rounded-lg outline-none focus:border-green-500 focus:bg-white text-center font-semibold text-lg'
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        disabled={!isValidOtp || isLoading} 
                        className={`${
                            isValidOtp && !isLoading 
                                ? "bg-green-800 hover:bg-green-700" 
                                : "bg-gray-500 cursor-not-allowed"
                        } text-white py-3 rounded font-semibold my-3 tracking-wide transition-colors`}
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className='text-center mt-4'>
                    <p className='text-gray-600'>
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResendOtp}
                            disabled={timer > 0 || isResending}
                            className={`font-semibold ${
                                timer > 0 || isResending
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-700 hover:text-green-800'
                            }`}
                        >
                            {isResending ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                        </button>
                    </p>
                </div>

                <div className='text-center mt-6 pt-4 border-t'>
                    <p className='text-gray-600'>
                        Remember your password?{' '}
                        <Link to="/login" className='font-semibold text-green-700 hover:text-green-800'>
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default EmailVerification