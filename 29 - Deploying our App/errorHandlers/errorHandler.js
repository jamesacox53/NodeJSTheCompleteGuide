const addErrorHandlers = (app) => {
    app.use(sendTo500Page);
};

const sendTo500Page = (error, request, response, next) => {
    console.log(error);
    response.redirect('/500');
};

exports.addErrorHandlers = addErrorHandlers;