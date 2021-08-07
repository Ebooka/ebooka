const express = require('express');
const router = express.Router();
const { pool } = require('../../queries');

/*  @route: GET /api/search/:term
 *  @desc: get all coincidences with writing titles or genres, as well as usernames
 *  @access: public, no authentication is required
 */
router.get('/:term', (req, res) => {
    try {
        const term = [req.params.term.toString()];
        const writingsQuery = 'SELECT w.*, u.username, u.profile_image FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE similarity(metaphone(title, 10), metaphone($1, 10)) > 0.1 ORDER BY similarity(metaphone(title, 10), metaphone($1, 10)) DESC LIMIT 5;';
        const usersQuery = 'SELECT username, followers, writings FROM users WHERE similarity(metaphone(username, 10), metaphone($1, 10)) > 0.1 ORDER BY similarity(metaphone(username, 10), metaphone($1, 10)) LIMIT 5;';
        let finalResults = [];
        pool.query(writingsQuery, term, (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error buscando en la base de datos'});
            if (results)
                finalResults.push(results.rows);
            pool.query(usersQuery, term, (error, results) => {
                if (error)
                    return res.status(400).json({msg: 'Error buscando en la base de datos'});
                if (results)
                    finalResults.push(results.rows);
                return res.status(200).json(finalResults);
            })
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/search/:term/:filter
 *  @desc: get all coincidences with writings or usernames only
 *  @access: public, no authentication is required
 */
router.get('/:term/:filter', (req, res) => {
    try {
        const term = [req.params.term.toString()];
        const filter = req.params.filter.toString();
        let query = '';
        let finalResults = [];
        switch (filter) {
            case 'writings':
                query = 'SELECT w.id, title, description, body, comments, genre, likes, viewers, anon_viewers, u.username, u.profile_image FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE similarity(metaphone(title, 10), metaphone($1, 10)) > 0.1 ORDER BY similarity(metaphone(title, 10), metaphone($1, 10)) DESC LIMIT 10;';
                break;
            case 'users':
                query = 'SELECT username, followers, writings FROM users WHERE similarity(metaphone(username, 10), metaphone($1, 10)) > 0.1 ORDER BY similarity(metaphone(username, 10), metaphone($1, 10)) LIMIT 10;';
                break;
        }
        pool.query(query, term, (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error buscando en la base de datos'});
            return res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

module.exports = router;
