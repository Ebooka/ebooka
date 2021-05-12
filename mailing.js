let nodemailer   = require('nodemailer');

const credentials = {
    email: 'ebooka.editorial@gmail.com',
    password: 'Coniluli12'
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.email,
        pass: credentials.password
    }
});

const sendRegistrationEmail = async (email, needsValidation, token, userResponse) => {
    console.log('send email');
    const link = 'https://ebooka-staging.herokuapp.com/validate/' + token;
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
            const value = res.accepted.length > 0 && res.response.includes('OK');
            if(value)
                return userResponse.status(200).json({msg: 'Cuenta creada con exito'});
            return userResponse.status(402).json({ msg: 'Error enviando mail de verificacion!' });
        })
        .catch(err => userResponse.stat(402).json({ msg: 'Error enviando mail de verificacion!' }));
}

const sendPasswordEmail = (email, token) => {
    const link = 'http://escritos-app.herokuapp.com/password/' + token;
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