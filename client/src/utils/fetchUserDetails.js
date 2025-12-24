import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{
    try {
        const accessToken = localStorage.getItem('accesstoken')
        if(!accessToken){
            return null
        }
        
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        return response.data
    } catch (error) {
        // Silently handle authentication errors
        if (error.response?.status === 401) {
            // Clear invalid tokens
            localStorage.removeItem('accesstoken')
            localStorage.removeItem('refreshToken')
        }
        return null
    }
}

export default fetchUserDetails