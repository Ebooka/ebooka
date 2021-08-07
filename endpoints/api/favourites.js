const express = require('express');
const router = express.Router();
const { pool } = require('../../queries');

router.get('/:id', (req, res) => {
    try {
        const query = 'SELECT w.*, u.username FROM writings AS w JOIN users as u ON w.writer_id = u.id where w.id in (select unnest(favourites) from users where id = $1);';
        pool.query(query, [req.params.id], (error, results) => {
            if (error)
                throw error;
            return res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

module.exports = router;
