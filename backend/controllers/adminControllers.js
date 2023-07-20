const User = require('../models/User')
const Exam = require('../models/Exam')
const TimeAndSpace = require('../models/TimeAndSpace')
const Topic = require('../models/TopicAndQuestion')
const OTP = require('../models/OTP')
const Email = require('../services/emailing')

const characterSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const idLength = 8;
const generateRandomCode = () => {
    let userCode = '';
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        userCode += characterSet[randomIndex];
    }
    return userCode;
}
  

module.exports.add_place = async (req, res) => {
    try{
        /*
        req.body = {
            country: country name,
            city: city name,
            location: location name,
            snacks: [snacks name]
            capacity: number
        }
        */
       console.log(req.body)
        const place = await TimeAndSpace.Country.insertPlace(req.body)
        res.json(place);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_time = async (req, res) => {
    /*
    req.body = {
        location_id: id,
        day: day name,
        appointment: time
    }
    */
    try{ 
        let day = await TimeAndSpace.Country.insertTime(req.body);
        
        day = await day.populate({
            path:'location',
            select: 'location_name parent max_number',
            populate:{
                path: 'parent',
                select: 'city_name parent',
                populate: {
                    path: 'parent',
                    select: 'country_name',
                }
            }
        });
        console.log(day);
        const result = {
            _id: day._id,
            time: day.appointment,
            day: day.day_name,
            location: day.location.location_name,
            city: day.location.parent.city_name,
            country: day.location.parent.parent.country_name,
            moderator: day.moderator,
            student: day.reserved_number,
            capacity: day.location.max_number,
            month_name: day.month_name,
            month_number: day.month_number,
            day_name: day.day_name,
            day_number: day.day_number
        }

        console.log(day);
        res.json(result);
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.add_new_exam = async (req, res) => {
    /*
    req.body = {
        title: new title,
        about: new about,
        info: new info
    }
    */
    try{
        console.log(req.body);
        const exam = await Exam.insertExam(req.body.new_exam);
        res.json(exam._id);
    }catch(err){
        console.log(err);
        res.json({success:false});
    }
}


module.exports.edit_exam = async (req, res) => {
    /*
        req.body = {
            _id: id of the exam,
            title: new title,
            about: new about
        }
    */
    try{
        const new_exam = {
            _id: req.body._id,
            title: req.body.new_exam.title,
            about: req.body.new_exam.about
        }
        await Exam.editExam(new_exam);
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}


module.exports.remove_exam = async (req, res) => {
    /*
        req.body = {
            _id: id of the exam
        }
    */
    try{
        await Exam.deleteExam(req.body)
        res.json({success: true});
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}



const populate_exams = async (users) => {
    
    return  result
}


module.exports.get_users_with_day = async (req, res) => {
    try{
        // const location 
        const day_id = req.body.day_id;
        let day = await TimeAndSpace.Day.findOne({_id: day_id})
        .select('reserved_users location').populate({
            path:'reserved_users',
            select: 'first_name last_name exams',

        })
        day.reserved_users = [...new Set(day.reserved_users)]

        // console.log(day);

        day = await day.populate({
            path:'reserved_users.exams.exam.location',
            select: 'location_name',
            // populate: {
            //     path: 'parent',
            //     select: 'city_name parent',
            //     populate: {
            //         path: 'parent',
            //         select: 'country_name'
            //     }
            // }
        })

        day = await day.populate({
            path: 'reserved_users.exams.exam._id',
            select: 'title'
        })



        // console.log(day);

        let result = []
        day.reserved_users.forEach((user) => {
            
            let exams_on_day = user.exams.filter((exam) => exam.exam.day.toString() === day_id);
            let exams_in_location = exams_on_day.filter((exam) =>exam.exam.location._id.toString() === day.location.toString())
            exams_in_location.forEach((exam) => {
                // exam: { 
                //  _id: exam.exam._id,
                //  snack: exam.exam.snack,
                //  percentage: exam.exam.percentage,
                //  appointment: exam.exam.appointment,
                //  location: exam.exam.location.location_name,
                //  city: exam.exam.location.parent.city_name,
                //  country: exam.exam.location.parent.parent.country_name}
                result.push({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    _id_user: user._id,
                    photo_user: user.photo_user,
                    location: exam.exam.location.location_name,
                    appointment: exam.exam.appointment,
                    percentage: exam.exam.percentage,
                    exam_title: exam.exam._id.title,
                    snack: exam.exam.snack.split(","),
                    exam_id:exam.exam._id._id

                 });
                 
             })
        })
        // const parsed_user = {
        //     _id: user._id,
        //     first_name: user.first_name,
        //     last_name: user.last_name,
        //     percentage: user.percentage,
        //     exams: result
        // }

        res.json(result) 
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.remove_location = async (req, res) => {
    /*
        location_id: 
    */
    try{
        await TimeAndSpace.Location.remove_location(req.body._id);
        res.json({success: true})
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}




module.exports.get_all_days = async (req, res) => {
    /*
    day_number:1,
    day_name:"saturday",
    month_name:"jan",
    month_number:"march",
    country:"egypt", //
    city:"alex", //
    location:"smouha", //
    _id: "1", /// 
    time:"5 pm", //
    moderator:"", //
    student:0, //
    capacity:25, ///
    */


    try{
        const all_days = await TimeAndSpace.Day.find().populate({
            path:'location',
            select: 'location_name parent max_number',
            populate:{
                path: 'parent',
                select: 'city_name parent',
                populate: {
                    path: 'parent',
                    select: 'country_name',
                }
            }
        });
        const result = all_days.map((day) => ({
            _id: day._id,
            time: day.appointment,
            day: day.day_name,
            location: day.location.location_name,
            city: day.location.parent.city_name,
            country: day.location.parent.parent.country_name,
            moderator: day.moderator,
            student: day.reserved_number,
            capacity: day.location.max_number,
            month_name: day.month_name,
            month_number: day.month_number,
            day_name: day.day_name,
            day_number: day.day_number
        }
         ))
        //  const parsed_user = {
        //      _id: user._id,
        //      first_name: user.first_name,
        //      last_name: user.last_name,
        //      percentage: user.percentage,
        //      exams: result
        //  }
        res.json(result)
    }catch(err){
        console.log(err);
        res.json(err);
    }
}






module.exports.delete_day = async (req, res) => {
    try{
        await TimeAndSpace.Day.remove_day(req.body)
        res.json({success: true})
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}



module.exports.set_percentage = async (req, res) => {

    try{
        const {user_id, exam_id, percentage} = req.body
        

        const user = await User.findOneAndUpdate(
            { _id: user_id, 'exams.exam._id': exam_id },
            { $set: { 'exams.$.exam.percentage': percentage } },
            { new: true }
          );
      
        if(!user){
            throw "This day is already full"
        }
        

        res.json(user);
    }catch(err){
        console.log(err);
        res.json({success: false});
    }
}



module.exports.set_exam_status = async (req, res) => {
    try {
        await Exam.setStatus(req.body)
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}



module.exports.add_topic = async (req, res) => {
    try {
        const result = await Exam.add_topic(req.body);
        if(!result)
            throw "a problem occurred while adding a topic"
        res.json(result)
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}

module.exports.get_topics = async (req, res) => {
    try {
        const result = await Exam.get_topics(req.body);
        if(!result)
            throw `a problem occurred while getting topics for exam: ${req.body.exam_id}`
        res.json(result) 
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}


module.exports.delete_topic = async (req, res) => {
    try {
        const result = await Exam.delete_topic(req.body);
        if(!result)
            throw "Error occurred when deleting topic"
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}


module.exports.edit_number_of_mcq = async (req, res) => {
    try {
        const topic_id = await Topic.edit_number_of_mcq(req.body);
        if(!topic_id)
            throw "Error occurred when editing number of mcq"
        res.json({success: true, _id: topic_id})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}

module.exports.edit_number_of_coding = async (req, res) => {
    try {
        const topic_id = await Topic.edit_number_of_coding(req.body);
        if(!topic_id)
            throw "Error occurred when editing number of coding"
        res.json({success: true, _id: topic_id})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}

module.exports.add_mcq = async (req, res) => {
    try {
        const mcq_id = await Topic.add_mcq(req.body);
        if(!mcq_id)
            throw "Error occurred when editing number of coding"
        res.json({success: true, _id: mcq_id})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}


module.exports.add_coding = async (req, res) => {
    try {
        const coding_id = await Topic.add_coding(req.body);
        if(!coding_id)
            throw "Error occurred when editing number of coding"
        res.json({success: true, _id: coding_id})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}


module.exports.delete_mcq = async (req, res) => {
    try {
        const result = await Topic.delete_mcq(req.body);
        if(!result)
            throw "Error occurred when editing number of coding"
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}


module.exports.delete_coding = async (req, res) => {
    try {
        const result = await Topic.delete_coding(req.body);
        if(!result)
            throw "Error occurred when editing number of coding"
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false});
    }
}

module.exports.edit_mcq = async (req, res) => {
    try {
        const result = await Topic.edit_mcq(req.body);
        if(!result)
            throw "Error occurred when editing mcq"
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error});
    }
}

module.exports.edit_coding = async (req, res) => {
    try {
        const result = await Topic.edit_coding(req.body);
        if(!result)
            throw "Error occurred when editing coding"
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error});
    }
}

module.exports.send_exam_code = async (req, res) => {
    try {
        const {user_id, exam_id} = req.body;
        const code = generateRandomCode();
        const email = await User.findById(user_id, 'email -_id')
        await Promise.all([
            OTP.insert({phone_namber: user_id, code: code, exam_id: exam_id}),
            Email.sendEmail(email, `Exam Code`,
            `Please use this code to enter the exam: ${code}\n
            Note: you can only use this code once, if you have already used and you will need to contact the moderator to send a new one`)
        ])
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error});
    }
}