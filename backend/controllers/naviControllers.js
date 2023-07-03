const User = require('../models/User')
const Exam = require('../models/Exam')
const casual = require('casual');
const jwt = require('jsonwebtoken');
const { populate } = require('../models/Admin');
const {Country} = require('../models/TimeAndSpace')

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
                        Exam.findOne({ _id: { $nin: exam_ids } }).select('title info about')
                      ]);

                    let startTime = Date.now();
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
                        snack: exam.exam.snack,
                        percentage: exam.exam.percentage,
                        appointment: exam.exam.appointment,
                        day: exam.exam.day.day_number + " " + exam.exam.day.month_name,
                        location: exam.exam.location.location_name,
                        city: exam.exam.location.parent.city_name,
                        country: exam.exam.location.parent.parent.country_name}
                    }))
                    const parsed_user = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        exams: result
                    }
                    
                    
                    // let endTime = Date.now();
                    // console.log(endTime-startTime);
                    res.json({user: parsed_user, token_exam_info, other_exam: other_exam});


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
        const exams = await Exam.find({ _id: { $nin: req.body.ids } }).select('title info about');
        res.json(exams);
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
        const places = await Country.find({deleted: false}).select('country_name cities').populate({
            path: 'cities',
            select: 'city_name locations',
            populate:{

              path: 'locations',
              select: 'location_name snacks max_number'
                
            }
        });
        console.log(places);
        res.json(places);
    }catch(err){
        console.log(err);
    }
}








