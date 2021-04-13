let nodemailer   = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'editorialwebapp@gmail.com',
        pass: '3d1t0r14l2020'
    }
});

const sendRegistrationEmail = (email, needsValidation, token) => {
    const link = 'http://escritos-app.herokuapp.com/validate/' + token;
    let mailOptions = needsValidation ?
    {
        from: 'editorialwebapp@gmail.com',
        to: email,
        subject: 'Confirmación de cuenta Bookla',
        text: '<p>Para poder confirmar tu cuenta hacé click <a href="' + link + '">acá</a>.</p>'
    } : {
        from: 'editorialwebapp@gmail.com',
        to: email,
        subject: 'Bienvenido a Bookla',
        text: '<p>Disfrutá de Bookla.</p>'
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error)
            return false;
        }
    });
    return true;
}

const sendPasswordEmail = (email, token) => {
    const link = 'http://escritos-app.herokuapp.com/password/' + token;
    let mailOptions = {
        from: 'editorialwebapp@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        text: 'Para modificar tu contraseña hacé click en el siguiente link: ' + link
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error)
            throw error;
    });
}

module.exports = { sendRegistrationEmail, sendPasswordEmail };