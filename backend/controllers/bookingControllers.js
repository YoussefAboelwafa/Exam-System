const User = require('../models/User')
const Exam = require('../models/Exam')


const payment = (req, res) => {
    console.log('payment succeeded');
}

module.exports.check_availability = async (req, res) => {
    ///assume req holds only
    // req should also contain the id, or any user identification
    try{
        const user = User.findOne('put user identification');
        const alreadyTaken = user.exams.filter((exam) => exam.name === req.name);
        if(!alreadyTaken.isEmpty()){
            const percentages = alreadyTaken.map((exam) => exam.percentage);
            const isBooked_or_isPassed = percentages.some((percentage) => percentage === 100 || percentage === 0); ///could split it in two for better alert messages
            if (isBooked_or_isPassed) {
                console.log('exam is either already and in the upcoming or the client has already taken it before a scored a 100 in it');
                res.send('exam is either already and in the upcoming or the client has already taken it before a scored a 100 in it');
            }
        }
        const exam = await Exam.findByID(req.id);

        const available = checkifemptyplacesstillavaliable(req);
        if(available){
            res.send('go on to the payment')
        }else{
            res.send('no available place')
        }
    }catch(err){
        console.log(err);
        res.json(err);
    }
}

module.exports.pay_for_exam = async (req, res) => {
    // assume that the user has paid for exam and is now registered in db
    // req should also contain the id, or any user identification

    try{
        const user = User.findOne('put user identification');
        const alreadyTaken = user.exams.filter((exam) => exam.name === req.name);
        if(!alreadyTaken.isEmpty()){
            const percentages = alreadyTaken.map((exam) => exam.percentage);
            const isBooked_or_isPassed = percentages.some((percentage) => percentage === 100 || percentage === 0); ///could split it in two for better alert messages
            if (isBooked_or_isPassed) {
                console.log('exam is either already and in the upcoming or the client has already taken it before a scored a 100 in it');
                res.send('exam is either already and in the upcoming or the client has already taken it before a scored a 100 in it');
            }
        }
        const exam = await Exam.findByID(req.id);

        const available = checkifemptyplacesstillavaliable(exam, req);
    
        if(available){
            const paymentResult = payment();
            if(paymentResult === 'success'){
                user.find
            }
        }else{
            res.send('no available place')
        }
    }catch(err){
        console.log(err);
        res.json(err)
    }
}

