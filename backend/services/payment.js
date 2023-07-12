const axios = require('axios')
const sha256 = require('js-sha256');
const User = require('../models/User')

const merchant_hash_key = process.env.merchant_hash_key
const merchant_code = process.env.merchant_code
const baseURL = 'https://atfawry.fawrystaging.com/'
const amount = '50.00'
const returnUrl = 'https://youssefaboelwafa.github.io/Exam-System/home/home_bar/' ///check later


module.exports.start_payment= async (user, exam_info) => {
    try{       
        const {first_name, last_name, email, phone_namber, _id} = user;
        const current_time = Date.now().toString()
        const merchantRefNum = _id.toString() + "at" + current_time
        const result = await User.updateOne({_id: _id}, {$set: {last_booking_time: current_time}})

        const unhashed_signature = merchant_code + merchantRefNum +  returnUrl + exam_info.exam_id.toString() + '1' + amount + merchant_hash_key;
        if(result.modifiedCount === 0){
            throw "Error setting last booking time, no money was taken yet"
        }

        let data = {
            merchantCode: merchant_code,
            merchantRefNum: merchantRefNum,
            customerMobile: phone_namber,
            customerEmail: email,
            customerName: first_name + " " + last_name,
            language : "en-gb",
            
            chargeItems: [
                {
                    itemId: exam_info.exam_id.toString(), /// check later
                    description: JSON.stringify(exam_info), /// change later
                    price: amount, /// change later
                    quantity: '1'
                }
            ],
            returnUrl: returnUrl,
            authCaptureModePayment: false,
            signature: sha256(unhashed_signature)
        };

        
        let axiosConfig = {
            method: 'post',
            baseURL: baseURL, 
            url: 'fawrypay-api/api/payments/init',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        }
        
        const res = await axios(axiosConfig);
        // console.log(res);
        return res.data
    }catch(err){
        console.log("hellooo world ---------------------------------------");
        console.log(err);
        return false
    }
}



module.exports.get_order = async (merchantRefNumber, old_signature) => {
    try {
        const signature = sha256(merchant_code + merchantRefNumber + merchant_hash_key)

        let res = await axios.get(`https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/status/v2?merchantCode=${merchant_code}&merchantRefNumber=${merchantRefNumber}&signature=${signature}`)
        console.log(res.orderItems);
        return res
    } catch (err) {
        console.log("hellooo world ---------------------------------------");
        console.log(err);
        return false
    }
}