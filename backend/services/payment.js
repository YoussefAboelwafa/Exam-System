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
                    description: 'Product Description', /// change later
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
        // console.log(merchantRefNumber);
        // const merchant_hash_key_without_dashes = merchant_hash_key.replace(/^-|-$|-/g, '');
        // const unhashed_signature = merchant_code + merchantRefNumber + merchant_hash_key_without_dashes
        // console.log(unhashed_signature);
        // "341c6bad323a486abe2d41c17a4abb2f"
        // let data = {
        //     merchantCode: merchant_code,
        //     merchantRefNumber: merchantRefNumber,
        //     signature: sha256(unhashed_signature)
        // };

        // let axiosConfig = {
        //     method: 'GET',
        //     baseURL: baseURL, 
        //     url: 'ECommerceWeb/Fawry/payments/status/v2',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }

        const jsSHA = require('jssha');
        let merchantCode = merchant_code;
        let merchantRefNumber = merchantRefNumber;
        let merchant_sec_key = merchant_hash_key.replace(/^-|-$|-/g, '');
        let signature_body = merchantCode.concat(merchantRefNumber,merchant_sec_key);

        let sha256 = new jsSHA('SHA-256', 'TEXT');
        sha256.update(signature_body);
        let hash_signature = sha256.getHash("HEX");
        let res = await axios.get('https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/status/v2', {
                        merchantCode: merchantCode,
                        merchantRefNumber: merchantRefNumber,
                        signature: hash_signature
                                    })
        console.log(res);
        return false
    } catch (err) {
        console.log("hellooo world ---------------------------------------");
        console.log(err);
        return false
    }
}