const csrfSyncOptionsObj =  {
  getTokenFromRequest: (req) => {
    return req.body["CSRFToken"];
  }
};

module.exports = csrfSyncOptionsObj;