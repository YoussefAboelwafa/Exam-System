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
                   const id = req.body._id
                    let user = await User.findById(id).select({first_name: 1, last_name: 1, exams: 1, _id: 1});

                    const exam_ids = user.exams.map((exam)=>exam._id);

      
                    const [token_exam_info, other_exam] = await Promise.all([
                        Exam.find({ _id: { $in: exam_ids } }).select('title about'),
                        Exam.findOne({ _id: { $nin: exam_ids } }).select('title info about')
                      ]);

                      let startTime = Date.now();
                    user = await user.populate('exams.day').select('day_name').populate('exams.location').select('location_name');
                    console.log(user);               
// ======= 
//                     const token_exam_info = (await Exam.find({ _id: { $in: exam_ids } }).select('title info about')).map((elem) => ({title: elem.title, about:elem.about,info:elem.info}));
// >>>>>>> main
                    
                    const result = user.exams.map((exam) => ({
                       exam: { 
                        _id: exam.exam._id,
                        snack: exam.exam.snack,
                        percentage: exam.exam.percentage,
                        appointment: exam.exam.appointment,
                        day: exam.exam.place_and_time_id.day_name,
                        location: exam.exam.place_and_time_id.parent.location_name,
                        city: exam.exam.place_and_time_id.parent.parent.city_name,
                        country: exam.exam.place_and_time_id.parent.parent.parent.country_name}
                    }))
                    const parsed_user = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        percentage: user.percentage,
                        exams: result
                    }
                    // user.exams = result
                    
                    let endTime = Date.now();
                    console.log(endTime-startTime);
                    res.json({user: parsed_user, token_exam_info, other_exam: other_exam});


                }
            })
        }else{
            res.json({signed_in: false});
        }
    }catch(err){
        console.log(err);
        res.json({signed_in: false});
    }
   
}

module.exports.getOtherExams = async (req, res) => {
    ///assume req holds only
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
        const places = await Country.find().select('country_name cities').populate({
            path: 'cities',
            select: 'city_name locations',
            populate:{
                path: 'location',
                select: 'location_name',
            }
        });
        console.log(places);
        res.json(places);
    }catch(err){
        console.log(err);
    }
}








