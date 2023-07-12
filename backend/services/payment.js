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
        console.log(merchantRefNumber);
        const unhashed_signature = "adfasdfasdfsad" + merchantRefNumber + merchant_hash_key
        console.log(unhashed_signature);
        let data1 = {
            merchantCode: merchant_code,
            merchantRefNumber: merchantRefNumber,
            signature: sha256("adfasdfasdfsad" + merchantRefNumber + merchant_hash_key)
        };

        let data2 = {
            merchantCode: "asdfasdfasdfasdfasdf",
            merchantRefNumber: merchantRefNumber,
            signature: sha256(merchant_code + merchantRefNumber + merchant_hash_key)
        };

        let data3 = {
            merchantCode: merchant_code,
            merchantRefNumber: merchantRefNumber,
            signature: sha256(merchant_code + merchantRefNumber + "adsfasdfasdfasdfasdfasfd")
        };
    
        let data4 = {
            merchantCode: merchant_code,
            merchantRefNumber: "asdfasdfasdfdfasd",
            signature: sha256(merchant_code + "asdfasdfasdfdfasd" + merchant_hash_key)
        };
    
        
        let axiosConfig1 = {
            method: 'GET',
            baseURL: baseURL, 
            url: 'ECommerceWeb/Fawry/payments/status/v2',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data1),
            body: JSON.stringify(data1)
        }

        let axiosConfig2 = {
            method: 'GET',
            baseURL: baseURL, 
            url: 'ECommerceWeb/Fawry/payments/status/v2',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data2),
            body: JSON.stringify(data2)
        }

        let axiosConfig3 = {
            method: 'GET',
            baseURL: baseURL, 
            url: 'ECommerceWeb/Fawry/payments/status/v2',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data3),
            body: JSON.stringify(data3)
        }

        let axiosConfig4 = {
            method: 'GET',
            baseURL: baseURL, 
            url: 'ECommerceWeb/Fawry/payments/status/v2',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data4),
            body: JSON.stringify(data4)
        }

        const res1 = await axios(axiosConfig1);
        const res2 = await axios(axiosConfig2);
        const res3 = await axios(axiosConfig3);
        const res4 = await axios(axiosConfig4);
        console.log("res1", res1);
        console.log("res2", res2);
        console.log("res3", res3);
        console.log("res4", res4);
        return false
    } catch (err) {
        console.log("hellooo world ---------------------------------------");
        console.log(err);
        return false
    }
}