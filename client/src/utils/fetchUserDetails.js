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
        console.log(error)
        return null
    }
}

export default fetchUserDetails