const axios = require('axios')
const sha256 = require('js-sha256');
const User = require('../models/User')


const merchant_hash_key = "$2y$10$zkNcAi.MUIvKc.arq3HMFuasoEQ4yvzSXkR45sfzQL0bBHXPbCjo2"
const merchant_code = "UxrqrLTixPdu" 
const baseURL = 'https://staging.cowpay.me/api/v2/'
const amount = "10.00"
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWI5YzA0ZmMyNTQyZDU1ODMzMmVhYTIyODdlM2FmMTFlYmYwZWEzZDQ5MmNjN2VmYzUxM2RjM2VhNWU2MzExYmIzODU1NGZhMTI1OTRjZDgiLCJpYXQiOjE2ODg3NDcxMjUuOTg5NjI2LCJuYmYiOjE2ODg3NDcxMjUuOTg5NjMyLCJleHAiOjQ4NDQ0MjQzMjUuOTg0MTA0LCJzdWIiOiIyMzQxIiwic2NvcGVzIjpbXX0.E8BGmZedNiMZlEom_QTlXtMRPXbDmxvnlFaQYPuutr8wby6Bou8dfFcbSY4cjKSsvGdOlhBYQWYLOHvRbWwUiZRKj5LFX2ooo7jBDOSwCNTSZSqM-jQZbjQMnm6sumQK_jMM1YQj_VaNw8BBHs2pD9pjZ3GCsT_5c5NJ8Qip5qbtj_tDU8uyOMUQofAEHZ97rmSJx50Hz_MCypbEXuubN5hfUlv8Usg_qTG3UThTzLynR8KZhzvRncZda9sG20GMrJ4IarDWc-P8O5SDzllX9BOACRlU7M-cFSPdjKiHtyxLCwzeLFua-WTvnKdLSFBqL5uBS4MnzGSVvpLQfY-sLJnxQ5rqXtavp9uDoWEk1s03Ine8HCBXkn5yTHNahUh_vnyaBk6wrD9hzmhti_FsnpioRw7xorS9jDsTYAtmEjSG0Oy9FwWU9p2Dk7slfFRUz0gq9phfwSZZu1G42o_spXpsSMj25JKTnmMPsW_AO-2pTKQZbhMgcajr6xZLu87aYvK8CzgscinmyI2REbIZcLGcB9HZGuLK3GRPdCs-W1gal6Xm9fsGrpdeYiI3QYp5L22EqvvV7xEWerm6uGcfJaSX8ZpPDVE1oeP7UZZ4rY2-UelDIC6eXsX_vG6M73P0djL4EgYzIryLzf4q9J8jQTYrQqLaZ-K32OBhfhaaoCM'

/*
{
  "merchant_reference_id": "mc-12545",
  "customer_merchant_profile_id": "253",
  "customer_name": "John Doe",
  "customer_email": "example@gmail.com",
  "customer_mobile": "+201xxxxxxxxx",
  "amount": "10.00",
  "signature": "6fec70795ae74b15f43fd645d85e2b03c86f8a08c2c671ab345914c0eae4f7da",
  "description": "Charge request description"
}

*/
module.exports.cowpay_init_and_auth= async (user) => {
    try{       
        const {first_name, last_name, email, phone_namber, _id} = user;
        const current_time = Date.now().toString();
        const reference_id = _id.toString() + 'at' + current_time;

        const result = await User.updateOne({_id: _id}, {$set: {last_booking_time: current_time}})
        if(result.modifiedCount === 0){
            throw "Error setting last booking time, no money was taken yet"
        }
        console.log(result);
        let data = {
            "merchant_reference_id": `${merchant_code}-${reference_id}`,
            "customer_merchant_profile_id": _id,
            "customer_name": first_name + " " + last_name,
            "customer_email": email,
            "customer_mobile": phone_namber,
            "amount": amount,
            "signature": sha256(merchant_code + `${merchant_code}-${reference_id}` + _id + amount + merchant_hash_key),
            "description": "Jammal tech exam booking",
            "transaction_type": "sale-auth"
        }


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




