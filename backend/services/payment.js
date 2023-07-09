const axios = require('axios')
const sha256 = require('js-sha256');
const User = require('../models/User')


const merchant_hash_key = ""
const merchant_code = "" 
const baseURL = 'https://atfawry.fawrystaging.com/fawrypay-api/api/'
const amount = 50.00


module.exports.cowpay_init_and_auth= async (user, user_exam) => {
    try{       
        const {first_name, last_name, email, phone_namber, _id} = user;
        const {exam_id} = user_exam;
        const current_time = Date.now().toString();
        const reference_id = _id.toString() + 'at' + current_time;

        const result = await User.updateOne({_id: _id}, {$set: {last_booking_time: current_time}})
        if(result.modifiedCount === 0){
            throw "Error setting last booking time, no money was taken yet"
        }
        console.log(result);
        let data = {
            // merchantCode: merchant_code,
            // merchantRefNum: reference_id,
            // customerMobile: phone_namber,
            // customerEmail: email,
            // customerName: first_name + " " + last_name,
            // customerProfileId: _id.toString(),
            // paymentExpiry: , /////////// set later
            // language : "en-gb",
            // chargeItems: [
            //         {
            //             itemId: exam_id,
            //             description: 'Product Description', /// don't know if i should set it to just the description of the exam or the options the user's chose
            //             price: amount, ////
            //             quantity: 1
            //         }
            // ],
            // returnUrl: 'https://developer.fawrystaging.com',
            // authCaptureModePayment: false,
            // signature: "2ca4c078ab0d4c50ba90e31b3b0339d4d4ae5b32f97092dd9e9c07888c7eef36"
        };


        let axiosConfig = {
            method: 'post',
            baseURL: baseURL, 
            url: 'charge/card/init',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
        
        const res = await axios(axiosConfig);
        console.log(res);
        return res
    }catch(err){
        console.log(err);
        return false
    }
}




module.exports.cowpay_capture= async (cowpay_reference_id, recieved_signature) => {
    try{
        // const {cowpay_reference_id, user_id} = param
        const signature = sha256(merchant_code + `${cowpay_reference_id}` + amount + merchant_hash_key);

        let data = {
            "cowpay_reference_id": cowpay_reference_id,
            "amount": amount,
            "signature": signature
        }


        let axiosConfig = {
            method: 'post',
            baseURL: baseURL, 
            url: 'charge/card/capture',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
        const result = await axios(axiosConfig)
        console.log(result);
        return true
    }catch(err){
        console.log(err);
        return false
    }
}


module.exports.return_money = async (param) => {
    try{
        const {cowpay_reference_id, user_id, last_booking_time} = param

        const status = await check_status(user_id, last_booking_time);
        console.log(status.order_status);

        if(status === "UNPAID" || status === "PAID"){
            refund_or_de_auth(cowpay_reference_id, status);
        }

        return true
    }catch(err){
        console.log(err);
        return false
    }
}



const refund_or_de_auth = async (cowpay_reference_id, status) => {
    try {
        const signature = sha256(merchant_code + cowpay_reference_id + amount + merchant_hash_key)
        let url = '';

        if(status === "PAID"){
            url = 'charge/card/refund'
        }else{
            url = 'charge/card/void'
        }
        let data = {
            "cowpay_reference_id": cowpay_reference_id,
            "amount": amount,
            "signature": signature
        }


        let axiosConfig = {
            method: 'post',
            baseURL: baseURL, 
            url: url,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }

        const status = await axios(axiosConfig);
        console.log(status);
    } catch (error) {
        console.log(error);
        return false
    }
}





const check_status = async (user_id, last_booking_time) => {
    // const merchant_reference_id = 
    try {
        const cowpay_reference_id = `${merchant_code}-${user_id + 'at' + last_booking_time}`
        const signature = sha256(merchant_code + cowpay_reference_id + merchant_hash_key )
        let data = {
            "merchant_reference_id": cowpay_reference_id,
            "signature": signature
        }


        let axiosConfig = {
            method: 'get',
            baseURL: baseURL, 
            url: 'charge/status',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }

        const status = await axios(axiosConfig);
        return status.data
    } catch (error) {
        console.log(error);
        return false
    }
}




