const indexFunction = async (req, res, next) => {

    return res.json({
        status: 1,
        message: 'LMS Server is Running',
        data: {},
    });

};

const errorFunction = async (req, res, next) => {

    return res.json({
        status: 1,
        message: 'Something Went Wrong on server side',
        data: {},
    });

};


module.exports = {
    indexFunction,
    errorFunction,
};