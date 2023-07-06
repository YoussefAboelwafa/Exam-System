const User = require('../models/User')
const Exam = require('../models/Exam')
const casual = require('casual');
const jwt = require('jsonwebtoken');
const { populate } = require('../models/Admin');
const TimeAndSpace = require('../models/TimeAndSpace')

const payment = (req, res) => {
    console.log('payment succeeded');
}




module.exports.getHome = async (req, res) => {
    try{
        let startTime = Date.now();
        const token = req.cookies.jwt;

        if(token){
            let startTime = Date.now();
            jwt.verify(token, 'example secret', async (err, decodedToken)=>{

                if(err){
                    console.log(err.message);
                    res.json({signed_in: false});
                }else{
                     /*
                    country: {type: String, required: true},
                    /city: {type: String, required: true},
                    /location: {type: String, required: true},
                    /day: {type: String, required: true},
                    /appointment: {type: String, required: true},
                    /snack: {type: String, required: true},
                    */
                   const id = decodedToken._id;
                   
                    let user = await User.findById(id).select({first_name: 1, last_name: 1, exams: 1, _id: 1});
                    if(!user){
                        throw "user doesn't exist"
                    }
                    const exam_ids = user.exams.map((exam)=>exam.exam._id);
                    // console.log(user.exams.exam);
                    console.log(exam_ids);

                    const [token_exam_info, other_exam] = await Promise.all([
                        Exam.find({ _id: { $in: exam_ids } }).select('title about'),
                        Exam.findOne({ _id: { $nin: exam_ids }, deleted:false }).select('title info about status')
                      ]);


                    user = await user.populate({
                        path:'exams.exam.day',
                        select: 'day_number month_name'
                    })

                    user = await user.populate({
                        path:'exams.exam.location',
                        select: 'parent location_name',
                        populate: {
                            path: 'parent',
                            select: 'city_name parent',
                            populate: {
                                path: 'parent',
                                select: 'country_name'
                            }
                        }
                    })

                    // console.log(user.exams[2].exam.day);
                    const result = user.exams.map((exam) => ({
                       exam: { 
                        _id: exam.exam._id,
                        snack: exam.exam.snack.split(","),
                        percentage: exam.exam.percentage,
                        appointment: exam.exam.appointment,
                        day: exam.exam.day.day_number + " " + exam.exam.day.month_name,
                        location: exam.exam.location.location_name,
                        city: exam.exam.location.parent.city_name,
                        country: exam.exam.location.parent.parent.country_name},
                        turn_on_off: exam.exam.status

                    }))
                    const parsed_user = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        exams: result
                    }
                    
                    
                    // let endTime = Date.now();
                    // console.log(endTime-startTime);
                    let parsed_other_exam = null;
                    if(other_exam){
                        parsed_other_exam = {
                            _id: other_exam._id,
                            title: other_exam.title,
                            about: other_exam.about,
                            info: other_exam.info,
                            turn_on_off: other_exam.status
                       };
                    }
                    res.json({user: parsed_user, token_exam_info, other_exam: parsed_other_exam});

                }
            })
        }else{
            res.json({signed_in: false});
        }
    }catch(err){
        console.log(err);
        res.json({signed_in: false, error:err});
    }
   
}

module.exports.getOtherExams = async (req, res) => {
    ///assume req holds only {ids:[user's exams]}
    // req should  also contain the ids of the taken and upcoming exams
    try{
        const token = req.cookies.jwt;

        if(token){
            jwt.verify(token, 'example secret', async (err, decodedToken)=>{
                if(err){
                    console.log(err.message);
                    res.json({success: false});
                }else{
                    let filter = {}
                    if(decodedToken.admin){
                        filter = { _id: { $nin: req.body.ids }, deleted: false}
                    }else{
                        filter = { _id: { $nin: req.body.ids }, deleted: false, status: true}
                    }
                    const exams = await Exam.find(filter).select('title info about status');

                    const parsed_exams = exams.map((exam) => ({
                            _id: exam._id,
                            title: exam.title,
                            info: exam.info,
                            about: exam.about,
                            turn_on_off: (exam.status)? 1 : 0
                        }))
                    res.json(parsed_exams);
                }
            })
        }else{
            res.json({err});
        }
        
    }catch(err){
        console.log(err);
        res.json(err);
    }
}



module.exports.populate_exams = async (req, res) =>{
    try{
        res.send('populate')
        for (let i = 0; i < 5; i++) {
            const entry = {
                title: casual.title,
                date: casual.date('YYYY-MM-DD'),
                booked_users: [],
                max_number: casual.integer(1, 100),
                about: casual.sentences(3),
                info: [casual.word, casual.word]
            };
            await Exam.create(entry)
            console.log(entry);
        }
    }catch(err){
        res.send('errrrrrrrrrrrrr')
        console.log(err);
    }
}


module.exports.get_places = async (req, res) => {
    try{
        const places = await TimeAndSpace.Country.find({deleted: false}).select('country_name cities').populate({
            path: 'cities',
            select: 'city_name locations',
            populate:{

              path: 'locations',
              select: 'location_name snacks max_number'
                
            }
        });
        res.json(places);
    }catch(err){
        console.log(err);
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







