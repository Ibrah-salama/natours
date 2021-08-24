const nodeMailer = require('nodemailer')

const sendEmail = async options =>{ 
    // 1) setup transporter 
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // secure:false,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    console.log('Auth');
    // 2) DEFINE EMAIL OPTIONS 
    const mailOptions = {
        from: 'Ibrahim Salama <ibrahiimsalama00@gmail.com>',
        to: options.email,
        subject:options.subject,
        text: options.message
        //html:
    }
    // 3) actually send the email
    await transporter.sendMail(mailOptions)
    console.log('await');
}

module.exports = sendEmail