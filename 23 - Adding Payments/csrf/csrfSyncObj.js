const csrfSyncOptionsObj =  {
  // getTokenFromRequest: (req) => {
    // return req.body["CSRFToken"];
  // }
  getTokenFromRequest: (req) => {
    const bodyToken = req.body["CSRFToken"];
    if (bodyToken) return bodyToken;
    
    return req.headers["x-csrf-token"];
  }
};

module.exports = csrfSyncOptionsObj;