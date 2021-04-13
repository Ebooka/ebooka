const express = require('express');
const router = express.Router();
const { pool } = require('../../queries');

/*  @route: GET /api/drafts/user/:id
 *  @desc: get all drafts from db by user
 *  @access: private
 */
router.get('/user/:id', (req, res) => {
    pool.query('SELECT DISTINCT * FROM drafts WHERE writer_id = $1 ORDER BY last_edited DESC;', [req.params.id] , (error, results) => {
        if(error)
            throw error;
            //res.status(404).json({ msg: 'Error buscando borradores' });
        return res.status(200).json(results.rows);
    })
});

/*  @route: GET /api/drafts/:id
 *  @desc: get a specific draft from db
 *  @access: public, no authentication is required
 */
router.get('/:id', (req, res) => {
    pool.query('SELECT * FROM drafts WHERE id = $1;', [req.params.id.valueOf()], (error, result) => {
        if(error)
            return res.status(404).json({ msg: 'Ese escrito no existe'});
        res.status(200).json(result.rows[0]);
    });
});

/*  @route: DELETE /api/drafts/:id
 *  @desc: delete a specific draft from db
 *  @access: public, no authentication is required
 */
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM drafts WHERE id = $1;', [req.params.id.valueOf()], (error, result) => {
        if(error)
            return res.status(404).json({ msg: 'Ese borrador no existe'});
        res.status(200).json({msg: 'Borrador eliminado con éxito'});
    });
});

/*  @route: POST /api/drafts
 *  @desc: create a new draft
 *  @access: so far its public, eventually it 
 *  should be accessible only for authenticated users
 */
router.post('/', (req, res) => {
    const insertQuery = 'INSERT INTO drafts(title, body, writer_id, genre, tags, subgenre, completed, description, cover) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;'
    const addToUserDraftsQuery = 'UPDATE users SET drafts = array_append(drafts, $1) WHERE id = $2;';
    let values = [req.body.title.toString(), req.body.body.toString(),
                  req.body.writer_id, req.body.genre, req.body.tags, req.body.subgenre, req.body.completed, req.body.description, req.body.cover];
    pool.query(insertQuery, values, (error, results) => {
        if(error)
        throw error;
            //return res.status(400).json({ msg: 'Error agregando borrador' });
        const draftCreated = results.rows[0];
        const draftId = draftCreated.id;
        pool.query(addToUserDraftsQuery, [draftId, req.body.writer_id], (error, results) => {
            if(error)
            throw error;    
            //return res.status(400).json({ msg: 'Error agregando borrador' });
            return res.status(200).json(draftCreated);
        });
    });
});


/*  @route: PUT /api/drafts/edit/:id
 *  @desc: edit draft
 *  @access: so far its public, eventually it 
 *  should be accessible only for authenticated users
 */
router.put('/edit/:id', (req, res) => {
    const updateQuery = 'UPDATE drafts SET title = $1, body = $2, genre = $3, tags = $4, last_edited = now(), completed = $5, subgenre = $6, description = $7 WHERE id = $8 RETURNING id;'
    let values = [req.body.title.toString(), req.body.body.toString(),
                    req.body.genre, req.body.tags, req.body.completed, req.body.subgenre, req.body.description, req.params.id.valueOf()];
    pool.query(updateQuery, values, (error, results) => {
        if(error)
            return res.status(400).json({ msg: 'Error editando borrador' });
        return res.status(200).json(results.rows[0]);
    });
});

/*  @route: GET /api/drafts/preview/:id
 *  @desc: get all drafts preview from one author
 *  @access: public, no authentication is required
 */
router.get('/preview/:username', (req, res) => {
    pool.query('SELECT title, genre, body, id FROM drafts WHERE writer_id = (SELECT id FROM users WHERE username = $1) ORDER BY last_edited DESC;', [req.params.username.toString()], (error, result) => {
        if(error)
            return res.status(404).json({ msg: 'Ese borrador no existe'});
        res.status(200).json(result.rows);
    });
});

router.post('/chapters', (req, res) => {
    const checkExistingChapters = 'SELECT chapters FROM drafts WHERE id = $1;';
    const insertChapter = 'INSERT INTO draft_chapters(body, draft_id) VALUES ($1, $2) RETURNING id;';
    const appendChapterToDraft = 'UPDATE drafts SET chapters = array_append(chapters, $1) WHERE id = $2;';
    const values = [req.body.body, req.body.draft_id];
    console.log(values);
    
    pool.query(checkExistingChapters, [req.body.draft_id], (error, results) => {
        if(error)
            throw error;
        const existingChapters = results.rows.length;
    })
    
    pool.query(insertChapter, values, (error, results) => {
        if(error)
            throw error;
        const chapterId = results.rows[0].id;
        pool.query(appendChapterToDraft, [chapterId, req.body.draft_id], (error, results) => {
            if(error)
                throw error;
            return res.status(200).json({ msg: 'Capítulo agregado con éxito' });
        });
    });
});

module.exports = router;