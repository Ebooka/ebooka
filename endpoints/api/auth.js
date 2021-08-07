const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { pool } = require('../../queries');
let { v4: uuid } = require('uuid');
const { sendPasswordEmail } = require('../../mailing');

/* @route:   POST /api/auth/user
 * @desc:    authenticate user
 * @access:  public
 */
router.post('/', (req, res) => {
    try {
        let username = '', password = '';
        let needsValidation = true;
        if ('token' in req.body) {
            needsValidation = false;
            username = jwt.decode(req.body.token).email;
        } else {
            username = req.body.username;
            password = req.body.password;
            if (!username || !password)
                return res.status(400).json({msg: 'Por favor completá todos los campos!'});
        }
        const query = needsValidation ? 'SELECT * FROM users WHERE username = $1;' : 'SELECT * FROM users WHERE email = $1;';
        pool.query(query, [username], (error, results) => {
            if (error)
                return res.status(404).json({msg: 'Problema al loggearse'});
            if (results.rows.length === 0)
                return res.status(404).json({msg: 'El usuario no existe'});
            const user = results.rows[0];
            if (user.valid && needsValidation) {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch)
                            return res.status(400).json({msg: 'Credenciales inválidas!'});
                        jwt.sign(
                            {id: user.id},
                            config.get('jwtSecret'),
                            {expiresIn: 3600 * 24},
                            (error, token) => {
                                if (error)
                                    throw error;
                                res.json({
                                    token,
                                    id: user.id,
                                    username: user.username,
                                    writings: user.writings,
                                    role: user.role,
                                    drafts: user.drafts,
                                    liked_posts: user.liked_posts,
                                    followed_users: user.followed_users,
                                    followers: user.followers,
                                    profile_image: user.profile_image
                                });
                            }
                        );
                    });
            } else if (user.valid && !needsValidation) {
                jwt.sign(
                    {id: user.id},
                    config.get('jwtSecret'),
                    {expiresIn: 3600 * 24},
                    (error, token) => {
                        if (error)
                            throw error;
                        res.json({
                            token,
                            id: user.id,
                            username: user.username,
                            writings: user.writings,
                            role: user.role,
                            drafts: user.drafts,
                            liked_posts: user.liked_posts,
                            followed_users: user.followed_users,
                            followers: user.followers,
                            profile_image: user.profile_image
                        });
                    }
                );
            } else {
                return res.status(400).json({msg: 'La cuenta no ha sido verificada aún. Revisá tu correo.'})
            }
        })
    } catch (e) {
        return res.status(500);
    }
})


/* @route:   GET /api/auth/user
 * @desc:    get user data
 * @access:  private
 */
router.get('/', auth, (req, res) => {
    try {
        const username = req.header('x-auth-username');
        if (username) {
            const query = 'SELECT id, name, username, email, liked_posts, followers, followed_users, role, writings, favourites, drafts, profile_image, biography, external_account, likes_notif_active, comments_notif_active, follows_notif_active, tags_notif_active FROM users WHERE username = $1;';
            pool.query(query, [username], (error, results) => {
                if (error)
                    return res.status(404).json({msg: 'Usuario inexistente'});
                return res.status(200).json(results.rows[0]);
            });
        } else {
            return res.status(400).json({msg: 'Usuario no registrado!'});
        }
    } catch (e) {
        return res.status(500);
    }
});

router.post('/password', (req, res) => {
    try {
        const token = uuid();
        const query = 'INSERT INTO password_recoveries(token, email) VALUES ($1, $2);';
        const email = req.body.email;
        pool.query(query, [token, email], (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error generando recuperación de contraseña'});
            sendPasswordEmail(email, token);
            return res.status(200).json({msg: 'Código generado exitosamente'});
        });
    } catch (e) {
        return res.status(500);
    }
});

router.post('/change-password', (req, res) => {
    try {
        const query = 'UPDATE users SET password = $1 WHERE email = $2;';
        const findEmailQuery = 'SELECT email FROM password_recoveries WHERE token = $1;';
        pool.query(findEmailQuery, [req.body.token], (error, results) => {
            if (error || results.rows.length === 0) return res.status(400).json({msg: 'Error encontrando cuenta!'});
            const email = results.rows[0].email;
            console.log(email);
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(req.body.password, salt, (error, hash) => {
                    if (error) return res.status(400);
                    pool.query(query, [hash, email], (error, results) => {
                        if (error) return res.status(400);
                        return res.status(200).json({msg: 'Contraseña actualizada exitosamente!'});
                    });
                });
            });
        });
    } catch(e) {
        return res.status(500);
    }
});

module.exports = router;
