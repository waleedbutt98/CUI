const winston = require('../../../../config/winston'),
    mongoose = require('mongoose'),
    userAccount = mongoose.model('userAccount'),
    Class = mongoose.model('Class')
    bcrypt = require('bcryptjs');

// Assignment 3

// Dashboard
const getAdminDashboard= async function (req, res, next){

    const users = await userAccount.find({});
    const classes = await Class.find({});

    if (!users || !classes) {
        return next({msgCode: 15});
    }
    return res.json({
        status: 0,
        messsage: 'Data for Admin Dashboard',
        data:{
            users,
            classes
        }
    })
};

// Class List
const getClasses= async function (req, res, next){
    const classes = await Class.find({});

    if (!classes) {
        return next({msgCode: 15});
    }
    return res.json({
        status: 0,
        messsage: 'Class Lists Available',
        data:{classes}
    });
};

// Add New Class
const addClass= async function (req, res, next){
    try {
        const course = req.body.course;
        const code = req.body.code;
        const room = req.body.room;

        const options = {
             course,
             code,
             room
        }
        new Class(options)
            .save( function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 17})
                };

                return res.json({
                    status: 0,
                    messsage: 'Class Added Successfully',
                    data:{}
                });
            });
            
    } catch (err) {
        winston.error(err);
        return next({msgCode: 17});
    }
};

// Add New Teacher
const addTeacher= async function (req, res, next){
    try {
        const name = req.body.name;
        const profileImage = req.body.profileImage;
        const email = req.body.email;
        const password = req.body.password;
        const userType = 'teacher';
        const phoneNumber = req.body.phoneNumber;

        const options = {
             name,
             profileImage,
             email,
             password,
             userType,
             phoneNumber

        }
        new userAccount(options)
            .save( function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 5})
                };

                return res.json({
                    status: 0,
                    messsage: 'User Created Successfully',
                    data:{}
                });
            });
            
    } catch (err) {
        winston.error(err);
        return next({msgCode: 6});
    }
};

// Add New Student
const addStudent= async function (req, res, next){
    try {
        const name = req.body.name;
        const profileImage = req.body.profileImage;
        const email = req.body.email;
        const password = req.body.password;
        const userType = 'student';
        const phoneNumber = req.body.phoneNumber;

        const options = {
             name,
             profileImage,
             email,
             password,
             userType,
             phoneNumber

        }
        new userAccount(options)
            .save( function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 5})
                };

                return res.json({
                    status: 0,
                    messsage: 'User Created Successfully',
                    data:{}
                });
            });
            
    } catch (err) {
        winston.error(err);
        return next({msgCode: 6});
    }
};

// Modify Class
const updateClass= async function (req, res, next){
    try {

        const classID = req.params.id || '';

        const classToUpdate = await Class.findOne({_id: classID});

        if (!classToUpdate) {
            const err = next({msgCode: 19})
            winston.error(err);
            return err
        }
        const course = req.body.course || classToUpdate.course;
        const code = req.body.code || classToUpdate.code;
        const room = req.body.room || classToUpdate.room;

        const options = {
             course,
             code,
             room
        }

        Class.findByIdAndUpdate(classID, options, 
            function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 18});
                };

                return res.json({
                    status: 0,
                    messsage: 'Class Updated Successfully',
                    data:{}
                });
            });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 18})
    }
};

// Assign Teacher to Class
const assignTeacher= async function (req, res, next){
    try {

        const teacherID = req.params.id || '';

        const teacherToUpdate = await userAccount.findOne({_id: teacherID});

        if (!teacherToUpdate) {
            const err = next({msgCode: 20})
            winston.error(err);
            return err
        }

        const classID = req.body.classID;

        Class.findByIdAndUpdate(classID, {teacher: teacherToUpdate._id}, 
            function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 21});
                };

                return res.json({
                    status: 0,
                    messsage: 'Teacher Successfully assigned to Class',
                    data:{}
                });
            });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 21})
    }
};

// Add student to Class
const assignStudent= async function (req, res, next){
    try {

        const stdID = req.params.id || '';
        console.log('stdID: ', stdID);

        const classID = req.body.classID;
        console.log('classID: ', classID);

        const stdToUpdate = await userAccount.findOne({_id: stdID});
        console.log('stdToUpdate: ', stdToUpdate);

        if(!stdToUpdate) {
            const err = next({msgCode: 21});
            winston.error(err);
            return err;
        }

        Class.findByIdAndUpdate({_id: classID},
            {$push: {students: stdToUpdate._id}}, 
            function(err) {

                if (err) {
                    winston.error(err);
                    return next({msgCode: 21});
                };

                return res.json({
                    status: 0,
                    messsage: 'Student Successfully added to Class',
                    data:{}
                });
            });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 21})
    }
};

// Delete Class
const deleteClass= async function (req, res, next){
    try {

        Class.findOneAndDelete({_id: req.params.id}, function(err){
            if (err) {
                winston.error(err);
                return next({msgCode: 22});
            }

            return res.json({
                status: 0,
                messsage: 'Deleted Successfully',
                data:{}
            });

        });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 22});
    }
};

// Delete Teacher
const deleteTeacher= async function (req, res, next){
    try {

        userAccount.findOneAndDelete({_id: req.params.id}, function(err){
            if (err) {
                winston.error(err);
                return next({msgCode: 22});
            }

            return res.json({
                status: 0,
                messsage: 'Deleted Successfully',
                data:{}
            });

        });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 22});
    }
};

// Delete Student
const deleteStudent= async function (req, res, next){
    try {

        userAccount.findOneAndDelete({_id: req.params.id}, function(err){
            if (err) {
                winston.error(err);
                return next({msgCode: 22});
            }

            return res.json({
                status: 0,
                messsage: 'Deleted Successfully',
                data:{}
            });

        });

    } catch (err) {
        winston.error(err);
        return next({msgCode: 22});
    }
};

module.exports = {
    getAdminDashboard,
    getClasses,
    addClass,
    addTeacher,
    addStudent,
    assignTeacher,
    assignStudent,
    updateClass,
    deleteClass,
    deleteTeacher,
    deleteStudent
}