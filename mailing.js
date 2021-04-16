let nodemailer   = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'editorialwebapp@gmail.com',
        pass: '3d1t0r14l2020'
    }
});

const sendRegistrationEmail = async (email, needsValidation, token, userResponse) => {
    console.log('send email');
    const link = 'https://ebooka-staging.herokuapp.com/validate/' + token;
    let mailOptions = needsValidation ?
    {
        from: 'editorialwebapp@gmail.com',
        to: email,
        subject: 'Confirmación de cuenta Ebooka',
        text: '<p>Para poder confirmar tu cuenta hacé click <a href="' + link + '">acá</a>.</p>'
    } : {
        from: 'editorialwebapp@gmail.com',
        to: email,
        subject: 'Bienvenido a Ebooka',
        text: '<p>Disfrutá de Ebooka.</p>'
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