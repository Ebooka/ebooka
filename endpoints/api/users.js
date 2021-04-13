const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
let { v4: uuid } = require('uuid');
const { pool } = require('../../queries');
const { sendRegistrationEmail } = require('../../mailing');

/* @route   POST /api/users
 * @desc    register new user
 * @access  public
 */
router.post('/', (req, res) => {
    //const { name, username, email, password, defaultImageURL, externalAccount, needsValidation } = req.body;
    let name, username, email, password, defaultImageURL, externalAccount, needsValidation;
    if('token' in req.body) {
        const {token} = req.body;
        const decoded = jwt.decode(token);
        name = decoded.name;
        username = decoded.email.toLowerCase().split('@')[0];
        email = decoded.email;
        password = decoded.at_hash;
        defaultImageURL = decoded.picture;
        externalAccount = true;
        needsValidation = false;
    } else {
        name = req.body.name;
        username = req.body.email.toLowerCase().split('@')[0];
        email = req.body.email;
        password = req.body.password;
        defaultImageURL = req.body.defaultImageURL;
        externalAccount = req.body.externalAccount;
        needsValidation = req.body.needsValidation;
    }
    if(!name || !email || !password || !username) {
        return res.status(400).json({ msg: 'Por favor ingresá todos los campos!' });
    }
    let newUsername = username;
    const query = `INSERT INTO users(name, username, email, password, role, profile_image, external_account, valid) VALUES($1, $2, $3, $4, 'USER', $5, $6, $7) RETURNING *;`;
    const validationQuery = 'INSERT INTO validation_tokens(token, username, password) VALUES($1, $2, $3);';
    let user = null;
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
            if(error) throw error;
            pool.query(query, [name, newUsername, email, hash, defaultImageURL, externalAccount, !needsValidation], async (error, result) => {
                if(error) {
                    if(error.code === '23505') { // duplicate email in db
                        if (error.detail.includes('username') && error.constraint === 'users_username_key') {
                            if (needsValidation) {
                                return res.status(400).json({msg: 'Ya existe una cuenta con este nombre de usuario!'});
                            } else {
                                let addedCorrectly = 0;
                                let num = 1;
                                while (addedCorrectly === 0) {
                                    newUsername = username + num++;
                                    addedCorrectly = await pool.query(query, [name, newUsername, email, hash, defaultImageURL, externalAccount, !needsValidation])
                                        .then(res => { user = res.rows[0]; return 1; })
                                        .catch(err => {
                                            if(err.constraint !== 'users_username_key')
                                                return -1;
                                            return 0;
                                        });
                                }
                                if(addedCorrectly === -1)
                                    return res.status(400).json({msg: 'Ya existe una cuenta con este email!'});
                            }
                        } else {
                            return res.status(400).json({msg: 'Ya existe una cuenta con este email!'});
                        }
                    } else {
                        console.log(error);
                        return res.status(400).json({msg: 'Error creando cuenta, por favor intentá más tarde!'});
                    }
                }
                if(needsValidation) {
                    const token = uuid();
                    pool.query(validationQuery, [token, newUsername, password], (error, result) => {
                        if(error)
                            return res.status(400).json({ msg: 'Error en el servidor' });
                        sendRegistrationEmail(email, needsValidation, token);
                    });
                } else {
                    sendRegistrationEmail(email, needsValidation, null);
                }
                jwt.sign(
                    {id: user ? user.id : result.rows[0].id},
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
                return res.status(200).json({msg: 'Cuenta creada con exito'});
            });
        });
    });
});

router.post('/profile_image/:username', (req, res) => {
    pool.query('UPDATE users SET profile_image = $1 WHERE username = $2;', [req.body.userImage, req.params.username.toString()], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando foto de perfil' });
        res.status(200).json({ msg: 'Imagen agregada con exito' });
    });
})

router.put('/update/:id', (req, res) => {
    let query = 'UPDATE users SET name = $1, username = $2, email = $3, password = $4, biography = $5 WHERE id = $6 RETURNING id, name, username, email, liked_posts, followers, followed_users, role, writings, drafts, profile_image, biography, external_account;';
    let values = [req.body.name, req.body.username, req.body.email, req.body.password, req.body.biography, req.params.id];
    if(!req.body.password) {
        query = 'UPDATE users SET name = $1, username = $2, email = $3, biography = $4 WHERE id = $5 RETURNING id, name, username, email, liked_posts, followers, followed_users, role, writings, drafts, profile_image, biography, external_account;'
        values =  [req.body.name, req.body.username, req.body.email, req.body.biography, req.params.id];
    }    
    pool.query(query, values, (error, results) => {
        if(error)
            return res.status(400).json({ msg: 'Error actualizando datos de usuario!' });
        return res.status(200).json(results.rows[0]);
    });
})

router.get('/profile_image/:username', (req, res) => {
    pool.query('SELECT profile_image FROM users WHERE username = $1;', [req.params.username.toString()], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando foto de perfil' });
        res.status(200).json(results.rows[0]);
    });
});

router.get('/:username', (req, res) => {
    pool.query('SELECT username, followed_users, followers, id FROM users WHERE username = $1;', [req.params.username.toString()], (error, result) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando perfil' });
        res.status(200).json(result.rows[0]);
    });
});

router.get('/blocked-accounts/:id', (req, res) => {
    const query = 'SELECT u.username, u.profile_image, u.id FROM users AS u WHERE u.id IN (SELECT UNNEST(blocked_accounts) FROM users WHERE id = $1);';
    const values = [req.params.id];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json(results.rows);
    })    
});

router.put('/favourites', (req, res) => {
    const query = 'UPDATE users SET favourites = array_append(favourites, $1) WHERE id = $2;';
    const values = [req.body.writing_id, req.body.user_id];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json({ msg: 'Escrito agregado a favoritos exitosamente' });
    });
});

router.put('/remove-favourite', (req, res) => {
    const query = 'UPDATE users SET favourites = array_remove(favourites, $1) WHERE id = $2;';
    const values = [req.body.writing_id, req.body.user_id];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json({ msg: 'Escrito agregado a favoritos exitosamente' });
    });
});

router.put('/block', (req, res) => {
    const query = 'UPDATE users SET blocked_accounts = array_append(blocked_accounts, $1) WHERE id = $2;';
    const values = [req.body.blockedId, req.body.userId];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json({ msg: 'Usuario bloqueado exitosamente' });
    })
})

router.put('/unblock', (req, res) => {
    const query = 'UPDATE users SET blocked_accounts = array_remove(blocked_accounts, $1) WHERE id = $2;';
    const values = [req.body.blockedId, req.body.userId];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json({ msg: 'Usuario desbloqueado exitosamente' });
    })
})

router.put('/follow', (req, res) => {
    const query = 'UPDATE users SET followers = array_append(followers, $1) WHERE username = $2 RETURNING username, followed_users, followers, id;';    
    const queryUser = 'UPDATE users SET followed_users = array_append(followed_users, $1) WHERE id = $2;';
    const notificationInsertion = "INSERT INTO notifications(user_id, type, sender_id, post_id) values ($1, 'FOLLOW', $2, $3);"
    const values = [req.body.followerId, req.body.username.toString()];
    pool.query(query, values, (error, results) => {
        if(error)
            return res.status(404).json({ msg: 'Error siguiendo usuario' });
        const followedUser = results.rows[0];
        pool.query(queryUser, [followedUser.id, req.body.followerId], (error, results) => {
            if(error)
                return res.status(404).json({ msg: 'Error siguiendo usuario' });
            pool.query(notificationInsertion, [followedUser.id, req.body.followerId, null], (error, result) => {
                if(error)
                    return res.status(404).json({ msg: 'Error notificando follow' });
                return res.status(200).json({
                    username: followedUser.username,
                    followed_users: followedUser.followed_users,
                    followers: followedUser.followers
                });
            });
        });
    });
});

router.put('/unfollow', (req, res) => {
    const query = 'UPDATE users SET followers = array_remove(followers, $1) WHERE username = $2 RETURNING username, followed_users, followers, id';
    const queryUser = 'UPDATE users SET followed_users = array_remove(followed_users, $1) WHERE id = $2';
    const values = [req.body.unfollowerId, req.body.username.toString()];
    pool.query(query, values, (error, results) => {
        if(error)
            return res.status(404).json({ msg: 'Error dejando de seguir usuario' });
        const unfollowedUser = results.rows[0];
        pool.query(queryUser, [unfollowedUser.id, req.body.unfollowerId], (error, results) => {
            if(error)
                return res.status(404).json({ msg: 'Error dejando de seguir usuario' });
            return res.status(200).json({
                username: unfollowedUser.username,
                followed_users: unfollowedUser.followed_users,
                followers: unfollowedUser.followers
            });
        });
    });
});

router.get('/followed_accounts/:id', (req, res) => {
    const query = 'SELECT username FROM users WHERE id IN (SELECT unnest(followed_users) FROM users WHERE id = $1);';
    pool.query(query, [req.params.id], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando seguidos' });
        return res.status(200).json(results.rows);
    });
});

router.get('/followed_accounts_by_username/:username', (req, res) => {
    const query = 'SELECT username FROM users WHERE id IN (SELECT unnest(followed_users) FROM users WHERE username = $1);';
    pool.query(query, [req.params.username.toString()], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando seguidos' });
        return res.status(200).json(results.rows);
    });
});

router.get('/followers/:id', (req, res) => {
    const query = 'SELECT username FROM users WHERE id IN (SELECT unnest(followers) FROM users WHERE id = $1);';
    pool.query(query, [req.params.id], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando seguidores' });
        return res.status(200).json(results.rows);
    });
});

router.get('/followers_by_username/:username', (req, res) => {
    const query = 'SELECT username FROM users WHERE id IN (SELECT unnest(followers) FROM users WHERE username = $1);';
    pool.query(query, [req.params.username.toString()], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando seguidores' });
        return res.status(200).json(results.rows);
    });
});

router.get('/liked_posts/:id', (req, res) => {
    const query = 'SELECT w.title, w.likes, w.comments, u.username FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE w.id IN (SELECT unnest(liked_posts) FROM users WHERE id = $1);';
    pool.query(query, [req.params.id], (error, results) => {
        if(error)
            res.status(400).json({ msg: 'Error buscando posts likeados' });
        return res.status(200).json(results.rows);
    });
});

router.post('/validate', (req, res) => {
    const query = 'select t.id as tid, u.id as id, u.username, writings, role, drafts, liked_posts, followed_users, followers, profile_image, external_account from validation_tokens as t join users as u on t.username = u.username where token = $1 and now() < expiration_date'
    const deleteToken = 'delete from validation_tokens where id = $1;';
    const validateUser = "update users set valid = 'true' where id = $1;";
    const token = [req.body.token];
    pool.query(query, token, (error, results) => {
        if(error || results.rows.length === 0)
            return res.status(400).json({ msg: 'Token inválido' });
        const user = results.rows[0];
        const tokenId = user.tid;
        pool.query(deleteToken, [tokenId], (error, results) => {
            if(error)
                throw error;
            pool.query(validateUser, [user.id], (error, results) => {
                if(error)
                    throw error;
                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600*24 },
                    (error, token) => {
                        if(error) throw error;
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
                            profile_image: user.profile_image,
                            externalAccount: user.external_account
                        });
                    }
                );
            });
        })


    });
})

router.post('/update-notifications', (req, res) => {
    const query = 'UPDATE users SET likes_notif_active = $1, comments_notif_active = $2, tags_notif_active = $3, follows_notif_active = $4 WHERE id = $5;';
    const values = [req.body.likes_notif_active, req.body.comments_notif_active, req.body.tags_notif_active, req.body.follows_notif_active, req.body.userId];
    pool.query(query, values, (error, results) => {
        if(error)
            throw error;
        return res.status(200).json({ msg: 'Notificaciones actualizadas con éxito!' });
    });
});

module.exports = router;