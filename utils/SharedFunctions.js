function successfulRequest(response, status, message, data){
    return response.status(200).json({
        status: status,
        message: message,
        data: data
    })
}

function failedRequest(response, status, message, error){
    return response.status(400).json({
        status: status,
        message: message,
        error: error
    })
}

module.exports = {successfulRequest, failedRequest}