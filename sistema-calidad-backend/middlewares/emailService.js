// utils/emailService.js
const nodemailer = require('nodemailer');
 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Correo configurado
        pass: process.env.EMAIL_PASS, // Contraseña o token generado
    },
});
 
module.exports = transporter;