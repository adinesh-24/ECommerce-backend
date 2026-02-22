const globalError=(err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:err.message,
        statusCode:err.statusCode
    })
}

module.exports=globalError;