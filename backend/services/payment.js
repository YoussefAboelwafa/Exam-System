const axios = require('axios')
const sha256 = require('js-sha256');

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
module.exports.cowpay_init_and_auth= async (param) => {
    try{       
        let user = {
            first_name: "hello",
            last_name: "world",
            email:"example@gmail.com",
            phone:"+201096545211",
            _id: "64a704c55aafae9e951b1aee"
        }

        const reference_id = Date.now().toString() + '00' + user._id ;

        let data = {
            "merchant_reference_id": `${merchant_code}-${reference_id}`,
            "customer_merchant_profile_id": user._id,
            "customer_name": user.first_name + " " + user.last_name,
            "customer_email": user.email,
            "customer_mobile": user.phone,
            "amount": amount,
            "signature": sha256(merchant_code + `${merchant_code}-${reference_id}` + user._id + amount + merchant_hash_key),
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
        
        return await axios(axiosConfig)
    }catch(err){
        console.log(err.response.data);
        return err
    }
}




module.exports.cowpay_capture= async (param) => {
    try{
        // const {cowpay_reference_id, user_id} = param
        const cowpay_reference_id = 4018119
        let user = {
            first_name: "hello",
            last_name: "world",
            email:"example@gmail.com",
            phone:"+201096545211",
            _id: "64a704c55aafae9e951b1aee"
        } 
        let data = {
            "cowpay_reference_id": cowpay_reference_id,
            "amount": amount,
            "signature": sha256(merchant_code + `${cowpay_reference_id}` + amount + merchant_hash_key)
        }


        let axiosConfig = {
            method: 'post',
            baseURL: baseURL, // or https://staging.cowpay.me/api/v2/,
            url: 'charge/card/capture',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }
        
        return await axios(axiosConfig)
    }catch(err){
        console.log(err.response.data);
        return err
    }
}