// const sendMail=async (req,res)=>{
//     res.send("sending mail");
// }

// module.exports=sendMail;

const nodemailer=require("nodemailer");

const sendMail=async (req,res)=>{
    // let testAccount=await nodemailer.createTestAccount();

    // copy paste from =====https://ethereal.email/create
    const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'misael.aufderhar99@ethereal.email',
            pass: 'y8AfU4ZbEfwNJ6px8U'
            // user:"2k22.csai.2211576@gmail.com",
            // pass:"asm123@PSIT",
        }
    });

    // copy paste from ==========https://nodemailer.com/
    const info = await transporter.sendMail({
        from: '"Asmit 👻" <2k22.csai.221156@gmail.com>', // sender address
        to: "srivastava1234asmit@gmail.com",//baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("message send : %s",info.messageId);

    // res.send("i am sendin email");
    res.json(info);

}
module.exports=sendMail;