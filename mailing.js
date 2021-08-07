let nodemailer   = require('nodemailer');

const credentials = {
    email: 'ebooka.editorial@gmail.com',
    password: 'DjkQHvVXxL3Y8taf'
}

const options = {
    port: 587,
    host: 'smtp-relay.sendinblue.com',
    auth: {
        user: credentials.email,
        pass: credentials.password
    }
};

let transporter = nodemailer.createTransport(options)

const sendRegistrationEmail = async (email, needsValidation, token, userResponse) => {
    console.log('send email');
    const link = 'https://somosebooka.com/validate/' + token;
    let mailOptions = needsValidation ?
    {
        from: credentials.email,
        to: email,
        subject: 'Confirmación de cuenta Ebooka',
        html: '<p>Para poder confirmar tu cuenta hacé click <a href="' + link + '">acá</a>.</p>'
    } : {
        from: credentials.email,
        to: email,
        subject: 'Bienvenido a Ebooka',
        html: '<p>Disfrutá de Ebooka.</p>'
    }
    const ans = await transporter.sendMail(mailOptions)
        .then(res => {
            console.log(res);
            const value = res.accepted.length > 0 && res.response.includes('250');
            if(value)
                return userResponse.status(200).json({msg: 'Cuenta creada con exito'});
            return userResponse.status(402).json({ msg: 'Error enviando mail de verificacion!' });
        })
        .catch(err => {
            console.log(err);
            userResponse.stat(402).json({ msg: 'Error enviando mail de verificacion!' })
        });
}

const sendPasswordEmail = (email, token) => {
    const link = 'http://somosebooka.com/password/' + token;
    let mailOptions = {
        from: credentials.email,
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
