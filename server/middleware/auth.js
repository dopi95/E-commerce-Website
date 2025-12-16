import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        if(!token){
            return response.status(401).json({
                message : "Please login to continue",
                error : true,
                success : false
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode){
            return response.status(401).json({
                message : "Session expired. Please login again",
                error : true,
                success : false
            })
        }

        request.userId = decode.id

        next()

    } catch (error) {
        return response.status(401).json({
            message : "Authentication required. Please login to continue",
            error : true,
            success : false
        })
    }
}

export default auth