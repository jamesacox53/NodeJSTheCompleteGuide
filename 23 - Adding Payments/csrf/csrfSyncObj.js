const csrfSyncOptionsObj =  {
  // getTokenFromRequest: (req) => {
    // return req.body["CSRFToken"];
  // }
  getTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"];
  }
};

module.exports = csrfSyncOptionsObj;