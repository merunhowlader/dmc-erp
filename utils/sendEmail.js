import nodemailer from 'nodemailer';
import  smtpTransport from'nodemailer-smtp-transport';

const sendEmail = async (email, subject, text) => {

   
    try {
   

        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'bindulogicinventory@gmail.com',
                pass: 'Bindulogic123456',
            },
          }));
          

        const mailOptions = {
            from: 'bindulogicinventory@gmail.com',
            to: email,
            subject: subject,
            text: text,
          };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

   

       
    } catch (error) {
     
    }
};


export default sendEmail;
