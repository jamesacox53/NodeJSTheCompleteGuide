const fileStorageObj = {
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime().toString() + '-' + file.originalname);
    }
};

const fileFilterFunc = (req, file, cb) => {
    const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (acceptedFileTypes.includes(file.mimetype)) {
        return cb(null, true);
    
    } else {
        return cb(null, false);
    }
};

export default { fileStorageObj, fileFilterFunc };