const addErrorHandlers = (app) => {
    app.use(sendTo500Page);
};

const sendTo500Page = (error, request, response, next) => {
    response.redirect('/500');
};

exports.addErrorHandlers = addErrorHandlers;