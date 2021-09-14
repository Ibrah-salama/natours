const nodeMailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
// const sendEmail = async options =>{ 
    // 1) setup transporter 
    /*
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
    */
    // 2) DEFINE EMAIL OPTIONS 
    /*
    const mailOptions = {
        from: 'Ibrahim Salama <ibrahiimsalama00@gmail.com>',
        to: options.email,
        subject:options.subject,
        text: options.message
        //html:
    }
    */
    // 3) actually send the email
    // await transporter.sendMail(mailOptions)
// }

module.exports = class Email{ 
    constructor(user,url){
        this.to = user.email ; 
        this.firstName = user.name.split(' ')[0]; 
        this.url = url 
        this.from = `ibrahim salama <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV=== 'production') {
            //SendGrid
            return nodeMailer.createTransport({
                service:'SendGrid',
                auth:{
                    user:process.env.SEND_GRID_API_NAME,
                    pass: process.env.SEND_GRID_API_KEY
                }
            })
        }
        return nodeMailer.createTransport({
            service:'gmail',
            host: process.env.EMAIL_HOST,
            // port: process.env.EMAIL_PORT,
            // secure:false,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template,subject){
        //send the actual email 
        // 1) render html based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName : this.firstName,
            url:this.url,
            subject
        })
        // 2) Define email options 
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        //3) create a transport and send email 
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcom(){
        await this.send('welcome','welcome to the naturs family!')
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minuites)')
    }
}


