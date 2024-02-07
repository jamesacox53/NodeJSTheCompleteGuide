const addErrorHandlers = (app) => {
    app.use(send500Response);
};

const send500Response = (error, request, response, next) => {
    const status = error.u_statusCode || 500;
    const message = error.message;

    return response.status(status).json({
        message: message
    });
};

exports.addErrorHandlers = addErrorHandlers;