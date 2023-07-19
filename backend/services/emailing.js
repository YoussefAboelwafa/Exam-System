const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'gammalexambooking@gmail.com',
      pass: 'djvjnulxvitpdzcb'
    }
  });


module.exports.sendEmail = async (to, code, subject, text) => {
    try{
        const mailOptions = {
            from: 'gammalexambooking@gmail.com',
            to: to,
            subject: subject,
            text: text
          };
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    reject(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve('Email sent: ' + info.response);
                }
            });
        })
    }catch(err){
        console.log(err);
    }
}

