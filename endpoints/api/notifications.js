const express = require('express');
const router = express.Router();
const { pool } = require('../../queries');

router.get('/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const createView = "CREATE VIEW notifs AS (select n.id, case when type = 'LIKE' and u.likes_notif_active = 'true' then 'active' when type = 'COMMENT' and u.comments_notif_active = 'true' then 'active' when type = 'TAG' and u.tags_notif_active = 'true' then 'active' when type = 'FOLLOW' and u.follows_notif_active = 'true' then 'active' end from notifications as n join users as u on u.id = n.user_id where n.user_id = " + userId + " and n.sender_id != " + userId + ");";
        const dropViewIfExists = 'DROP VIEW IF EXISTS notifs';
        const mainQuery = 'SELECT read, type, created_at, u.username, u.id, u.profile_image, post_id, me.followed_users FROM notifications as n JOIN users AS u ON sender_id = u.id JOIN users AS me ON me.id = user_id JOIN notifs ON notifs.id = n.id WHERE user_id = $1 AND sender_id != $1 AND notifs.case IS NOT NULL ORDER BY created_at DESC;';
        pool.query(dropViewIfExists, (error, results) => {
            if (error)
                throw error;
            pool.query(createView, (error, results) => {
                if (error)
                    throw error;
                pool.query(mainQuery, [userId], (error, results) => {
                    if (error)
                        throw error;
                    const response = results.rows;
                    pool.query(dropViewIfExists, (error, results) => {
                        if (error)
                            throw error;
                        return res.status(200).json(response);
                    })
                })
            })
        })
    } catch (e) {
        return res.status(500);
    }
});

router.post('/:id', (req, res) => {
    try {
        const updateRead = 'UPDATE notifications SET read = TRUE WHERE user_id = $1;';
        const userId = req.params.id;
        pool.query(updateRead, [userId], (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error leyendo notificaciones'});
            return res.status(200).json({msg: 'Notificaciones leídas con éxito'});
        });
    } catch (e) {
        return res.status(500);
    }
});


// Create new notification
router.post('/', (req, res) => {
    try {
        const query = 'INSERT INTO notifications(user_id, sender_id, type, post_id) VALUES ($1, $2, $3, $4);'
        const getIdFromUsernameQuery = 'SELECT id FROM users WHERE username = $1;';
        pool.query(getIdFromUsernameQuery, [req.body.username.toString()], (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error buscando usuario'});
            if (results.rows[0]) {
                let user_id = results.rows[0].id;
                if (user_id) {
                    const values = [user_id, req.body.sender_id, req.body.type, req.body.post_id];
                    pool.query(query, values, (error, results) => {
                        if (error)
                            return res.status(400).json({msg: 'Error generando notificacion'});
                        return res.status(200).json({msg: 'Usuario notificado exitosamente'});
                    });
                }
            }
        });
    } catch (e) {
        return res.status(500);
    }
});

module.exports = router;
