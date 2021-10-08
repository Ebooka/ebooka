const express = require('express');
const router = express.Router();
const { pool } = require('../../queries');

/*  @route: GET /api/writings/page/:page
 *  @desc: get all writings from db
 *  @access: public, no authentication is required
 */
router.get('/page/:page/', (req, res) => {
    try {
        const query = 'SELECT w.id, w.title, w.body, w.writer_id, w.genre, w.cover, w.comments, w.likes, w.description, w.viewers, w.anon_viewers, w.last_edited, u.username FROM writings as w JOIN users as u ON w.writer_id = u.id ORDER BY last_edited DESC LIMIT 4 OFFSET $1;';
        const limit = 4;
        const offset = [parseInt(req.params.page) * limit];
        pool.query(query, offset, (error, results) => {
            if (error)
                throw error;
            //res.status(404).json({ msg: 'Error buscando escritos' });
            res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings-block/:id
 *  @desc: get all writings from db avoiding blocked users 
 *  @access: private
 */
router.get('/block/:id/page/:page', (req, res) => {
    try {
        const userId = req.params.id;
        let query = 'SELECT w.*, u.username, u.profile_image FROM writings as w JOIN users as u ON w.writer_id = u.id AND w.writer_id NOT IN (SELECT UNNEST(blocked_accounts) FROM users WHERE id = $1) ORDER BY last_edited DESC LIMIT 4 OFFSET $2;';
        pool.query(query, [userId, req.params.page], (error, results) => {
            if (error)
                res.status(404).json({msg: 'Error buscando escritos'});
            res.status(200).json(results ? results.rows : []);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/:id
 *  @desc: get a specific writing from db
 *  @access: public, no authentication is required
 */
router.get('/:id/', (req, res) => {
    try {
        const query = 'SELECT w.*, u.username, u.profile_image, u.id AS writer_id FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = $1;';
        pool.query(query, [req.params.id.valueOf()], (error, result) => {
            if (error)
                return res.status(404).json({msg: 'Ese escrito no existe'});
            res.status(200).json(result.rows[0]);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/genre/:genre
 *  @desc: get a specific genre from db
 *  @access: public, no authentication is required
 */
router.get('/genre/:genre/', (req, res) => {
    try {
        pool.query('SELECT w.*, u.username, u.profile_image FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.genre = $1;', [req.params.genre.toString()], (error, result) => {
            if (error)
                return res.status(404).json({msg: 'Esa categoría no existe'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/subgenre/:subgenre
 *  @desc: get a specific subgenre from db
 *  @access: public, no authentication is required
 */
router.get('/genre/:genre/subgenre/:subgenre/', (req, res) => {
    try {
        pool.query('SELECT w.*, u.username, u.profile_image FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.genre = $1 AND w.subgenre = $2;', [req.params.genre, req.params.subgenre.toString()], (error, result) => {
            if (error)
                return res.status(404).json({msg: 'Esa subcategoría no existe'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/username/:username
 *  @desc: get all writings from one user
 *  @access: public, no authentication is required
 */
router.get('/username/:username/', (req, res) => {
    try {
        pool.query('SELECT w.*, u.username FROM writings AS w JOIN users as u ON w.writer_id = u.id AND u.username = $1;', [req.params.username.toString()], (error, result) => {
            if (error)
                return res.status(404).json({msg: 'Ese género no existe'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/preview/:id
 *  @desc: get all writings preview from one author
 *  @access: public, no authentication is required
 */
router.get('/preview/:username/', (req, res) => {
    try {
        pool.query('SELECT title, genre, body, likes, viewers, anon_viewers, comments, id FROM writings WHERE writer_id = (SELECT id FROM users WHERE username = $1);', [req.params.username.toString()], (error, result) => {
            if (error)
                return res.status(404).json({msg: 'Ese escrito no existe'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/
 *  @desc: get all writings from db filtered by genre 
 *  @access: public, no authentication is required
 */
router.get('/filter/:filters/page/:page', (req, res) => {
    try {
        let params = req.params.filters;
        let sortQuery = ' ORDER BY last_edited DESC LIMIT 4 OFFSET $1;';
        let sortParam = params.split('sort=')[1].split('&')[0];
        let genres = [];
        let finalQuery = 'SELECT w.*, u.username, u.profile_image FROM writings as w JOIN users as u ON w.writer_id = u.id ';
        let genreQuery = '';
        if (sortParam === 'more-likes')
            sortQuery = ' ORDER BY array_length(likes, 1) DESC NULLS LAST LIMIT 4 OFFSET $1;';
        else if (sortParam === 'less-recent')
            sortQuery = ' ORDER BY last_edited ASC LIMIT 4 OFFSET $1;';
        if (params.includes('genre'))
            genres = params.split('genre=')[1].split('&')[0].split(',');
        if (genres.length > 0) {
            let count = 0;
            genreQuery += ' WHERE ';
            genres.forEach(genre => {
                count++;
                genre = genre.replace(/(\r\n|\n|\r)/gm, '');
                if (count === genres.length)
                    genreQuery += `genre = '${genre}'`;
                else
                    genreQuery += `genre = '${genre}' OR `;
            });
        }
        finalQuery += genreQuery + sortQuery;
        pool.query(finalQuery, [req.params.page], (error, results) => {
            if (error)
                return res.status(404).json({msg: 'Error filtrando resultados'});
            res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: GET /api/writings/
 *  @desc: get all writings from db filtered by genre 
 *  @access: public, no authentication is required
 */
router.get('/filter/block/:id/:filters/page/:page', (req, res) => {
    try {
        let params = req.params.filters;
        let sortQuery = ' ORDER BY last_edited DESC LIMIT 4 OFFSET $2;';
        let sortParam = params.split('sort=')[1].split('&')[0];
        let genres = [];
        const userId = req.params.id;
        let finalQuery = 'SELECT w.*, u.username, u.profile_image FROM writings as w JOIN users as u ON w.writer_id = u.id AND w.writer_id NOT IN (SELECT UNNEST(blocked_accounts) FROM users WHERE id = $1) ';
        let genreQuery = '';
        if (sortParam === 'more-likes')
            sortQuery = ' ORDER BY array_length(likes, 1) DESC NULLS LAST LIMIT 4 OFFSET $2;';
        else if (sortParam === 'less-recent')
            sortQuery = ' ORDER BY last_edited ASC LIMIT 4 OFFSET $2;';
        if (params.includes('genre'))
            genres = params.split('genre=')[1].split('&')[0].split(',');
        if (genres.length > 0) {
            let count = 0;
            genreQuery += ' WHERE ';
            genres.forEach(genre => {
                count++;
                genre = genre.replace(/(\r\n|\n|\r)/gm, '');
                if (count === genres.length)
                    genreQuery += `genre = '${genre}'`;
                else
                    genreQuery += `genre = '${genre}' OR `;
            });
        }
        finalQuery += genreQuery + sortQuery;
        pool.query(finalQuery, [userId, req.params.page], (error, results) => {
            if (error)
                return res.status(404).json({msg: 'Error filtrando resultados'});
            res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

router.post('/chapters/', (req, res) => {
    try {
        const insertChapter = 'INSERT INTO chapters(body, writing_id) VALUES($1, $2) RETURNING id;';
        const appendChapterToWriting = 'UPDATE writings SET chapters = array_append(chapters, $1) WHERE id = $2;';
        console.log('CONTENT', req.body.body, req.body.writing_id);
        const values = [req.body.body, req.body.writing_id];
        pool.query(insertChapter, values, (error, results) => {
            if (error)
                throw error;
            //return res.status(400).json({ msg: 'Error agregando el capítulo a la BD' });
            const chapterId = results.rows[0].id;
            pool.query(appendChapterToWriting, [chapterId, req.body.writing_id], (error, results) => {
                if (error)
                    throw error;
                //return res.status(400).json({ msg: 'Error agregando el capítulo al escrito' });
                return res.status(200).json({msg: 'Capítulo agregado con éxito!'});
            });
        });
    } catch (e) {
        return res.status(500);
    }
});

router.get('/chapters/:id/', (req, res) => {
    try {
        const getChaptersBodyQuery = 'SELECT c.body, c.id FROM chapters AS c WHERE c.id IN (SELECT UNNEST(chapters) FROM writings AS w WHERE w.id = $1) ORDER BY c.id;';
        pool.query(getChaptersBodyQuery, [req.params.id], (error, results) => {
            if (error)
                throw error;
            return res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: POST /api/writings
 *  @desc: create a new writing
 *  @access: private
 */
router.post('/',  (req, res) => {
    try {
        const insertQuery = 'INSERT INTO writings(title, body, writer_id, genre, tags, comments, likes, subgenre, description, cover, completed) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;'
        const addToUserWritingsQuery = 'UPDATE users SET writings = array_append(writings, $1) WHERE id = $2;';
        const getFollowerToNotify = 'SELECT unnest(followers) FROM users WHERE id = $1';
        const createNotificationForFollower = "INSERT INTO notifications(user_id, type, sender_id, post_id) values ($1, 'WRITING', $2, $3);"
        let values = [req.body.title.toString(), req.body.body.toString(),
            req.body.writer_id, req.body.genre, req.body.tags, null, null, req.body.subgenre, req.body.description, req.body.cover, req.body.completed];
        pool.query(insertQuery, values, (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error agregando escrito'});
            const writingCreated = results.rows[0];
            const writingId = writingCreated.id;
            pool.query(addToUserWritingsQuery, [writingId, req.body.writer_id], (error, results) => {
                if (error)
                    return res.status(400).json({msg: 'Error agregando escrito'});
                pool.query(getFollowerToNotify, [req.body.writer_id], (error, results) => {
                    if (error)
                        return res.status(400).json({msg: 'Error al querer notificar'});
                    const followers = results.rows;
                    if (followers.length > 0) {
                        for (let i = 0; i < followers.length; i++) {
                            pool.query(createNotificationForFollower, [followers[i].unnest, req.body.writer_id, writingId], (error, result) => {
                                if (error)
                                    return res.status(400).json({msg: 'Error creando notificación de seguidor'});
                            });
                        }
                    }
                    return res.status(200).json(writingId);
                });
            });
        });
    } catch (e) {
        return res.status(500);
    }
});


/*  @route: DELETE /api/writings
 *  @desc: delete a writing given its id
 *  @access: so far its public, eventually it 
 *  should be accessible only for authenticated users
 */ 
router.delete('/:id/', (req, res) => {
    try {
        const query = 'DELETE FROM writings WHERE id = $1';
        pool.query(query, [req.params.id.valueOf()], (error, results) => {
            if (error)
                throw error;
            //return res.status(404).json({ msg: 'Error eliminando escrito' });
            return res.status(200).json({msg: 'Escrito eliminado con éxito'});
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/viewer/:id/', (req, res) => {
    try {
        const query = 'UPDATE writings SET viewers = array_append(viewers, $1) WHERE id = $2 RETURNING *';
        const values = [req.params.id, req.body.writingId];
        pool.query(query, values, (error, results) => {
            if (error)
                throw error;
            return res.status(200).json(results.rows[0]);
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/anonViewer/:id/', (req, res) => {
    try {
        const query = 'UPDATE writings SET anon_viewers = array_append(anon_viewers, $1) WHERE id = $2 RETURNING *';
        const values = [req.params.id, req.body.writingId];
        pool.query(query, values, (error, results) => {
            if (error)
                return res.status(400).json({msg: 'Error adding viewer'});
            return res.status(200).json(results.rows[0]);
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/comment-like/', (req, res) => {
    try {
        const query = 'UPDATE commentItem SET likes = array_append(likes, $1) WHERE id = $2;';
        pool.query(query, [req.body.likerId, req.body.commentId], (error, results) => {
            if (error)
                throw error;
            return res.status(200).json({msg: 'Comentario likeado exitosamente'});
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/comment-unlike/', (req, res) => {
    try {
        const query = 'UPDATE commentItem SET likes = array_remove(likes, $1) WHERE id = $2;';
        pool.query(query, [req.body.likerId, req.body.commentId], (error, results) => {
            if (error)
                throw error;
            return res.status(200).json({msg: 'Comentario unlikeado exitosamente'});
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: PUT /api/writings/like
 *  @desc: likes a writing given its id
 *  @access: private
 */ 
router.put('/like/', (req, res) => {
    try {
        const query = 'UPDATE writings SET likes = array_append(likes, $1) WHERE id = $2 RETURNING *';
        const queryUser = 'UPDATE users SET liked_posts = array_append(liked_posts, $1) WHERE id = $2';
        const selectQuery = 'SELECT w.*, u.username FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = $1;';
        const notificationInsertion = "INSERT INTO notifications(user_id, type, sender_id, post_id) values ($1, 'LIKE', $2, $3);"
        const values = [req.body.likerId, req.body.writingId];
        pool.query(query, values, (error, results) => {
            if (error)
                return res.status(404).json({msg: 'Error liking post'});
            pool.query(queryUser, values.reverse(), (error, results) => {
                if (error)
                    return res.status(404).json({msg: 'Error liking post'});
                pool.query(selectQuery, [req.body.writingId], (error, results) => {
                    if (error)
                        return res.status(404).json({msg: 'Error liking post'});
                    const returnValue = results.rows[0]
                    const writerId = returnValue.writer_id;
                    pool.query(notificationInsertion, [writerId, req.body.likerId, req.body.writingId], (error, result) => {
                        if (error)
                            throw error;
                        //return res.status(404).json({ msg: 'Error notificando like' });
                        return res.status(200).json(returnValue);
                    });
                });
            });
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: PUT /api/writings/unlike
 *  @desc: unlikes a writing given its id
 *  @access: private
 */ 
router.put('/unlike/', (req, res) => {
    try {
        const query = 'UPDATE writings SET likes = array_remove(likes, $1) WHERE id = $2 RETURNING *';
        const queryUser = 'UPDATE users SET liked_posts = array_remove(liked_posts, $1) WHERE id = $2';
        const selectQuery = 'SELECT w.*, u.username FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = $1;';
        const values = [req.body.likerId, req.body.writingId];
        pool.query(query, values, (error, results) => {
            if (error)
                return res.status(404).json({msg: 'Error unliking post'});
            pool.query(queryUser, values.reverse(), (error, results) => {
                if (error)
                    return res.status(404).json({msg: 'Error unliking post'});
                pool.query(selectQuery, [req.body.writingId], (error, results) => {
                    if (error)
                        return res.status(404).json({msg: 'Error unliking post'});
                    return res.status(200).json(results.rows[0]);
                });
            });
        });
    } catch (e) {
        return res.status(500);
    }
});

/*  @route: PUT /api/writings/comment
 *  @desc: add comment to a writing
 *  @access: only authenticated users can comment
 */
router.post('/comment/', (req, res) => {
    try {
        const createCommentItem = 'INSERT INTO commentItem(commenter_id, writing_id, content, is_comment) VALUES($1, $2, $3, true) RETURNING id, writing_id, content;';
        const notificationInsertion = "INSERT INTO notifications(user_id, type, sender_id, post_id) values ($1, 'COMMENT', $2, $3);"
        const query = 'UPDATE writings SET comments = array_append(comments, $1) WHERE id = $2;';
        const selectQuery = 'SELECT w.*, u.username, u.profile_image, w.writer_id FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = $1;';
        pool.query(createCommentItem, [req.body.commenterId, req.body.writingId, req.body.content], (error, result) => {
            if (error)
                return res.status(400).json({msg: 'Error añadiendo comentario'});
            const commentCreated = {
                id: result.rows[0].id,
                writingId: result.rows[0].writing_id,
                content: result.rows[0].content
            };
            if (commentCreated) {
                const commentId = commentCreated.id;
                pool.query(query, [commentId, req.body.writingId], (error, result) => {
                    if (error)
                        res.status(400).json({msg: 'Error añadiendo comentario al posteo'});
                    pool.query(selectQuery, [req.body.writingId], (error, results) => {
                        if (error)
                            return res.status(404).json({msg: 'Error comentando posteo'});
                        const returnValue = results.rows[0];
                        const writerId = returnValue.writer_id;
                        pool.query(notificationInsertion, [writerId, req.body.commenterId, req.body.writingId], (error, result) => {
                            if (error)
                                return res.status(404).json({msg: 'Error notificando comentario'});
                            return res.status(200).json(commentCreated);
                        });
                    });
                });
            }
        });
    } catch (e) {
        return res.status(500);
    }
});

router.post('/response/', (req, res) => {
    try {
        const createResponse = 'INSERT INTO commentItem(commenter_id, in_response_to, writing_id, content, is_comment) VALUES ($1, $2, $3, $4, false) RETURNING id, writing_id, content;';
        const values = [req.body.commenterId, req.body.parentCommentId, req.body.writingId, req.body.content];
        const addToCommentResponseArray = 'UPDATE commentItem SET responses = array_append(responses, $1) WHERE id = $2';
        const addToCommentsWritingArray = 'UPDATE writings SET comments = array_append(comments, $1) WHERE id = $2';
        pool.query(createResponse, values, (error, results) => {
            if (error)
                throw error;
            const response = {
                id: results.rows[0].id,
                writingId: results.rows[0].writing_id,
                content: results.rows[0].content
            };
            console.log('response: ', response);
            pool.query(addToCommentResponseArray, [response.id, req.body.parentCommentId], (error, results) => {
                if (error)
                    throw error;
                pool.query(addToCommentsWritingArray, [response.id, req.body.writingId], (error, results) => {
                    if (error)
                        throw error;
                    return res.status(200).json(response);
                });
            });
        });
    } catch (e) {
        return res.status(500);
    }
});

router.get('/responses/:id/', (req, res) => {
    try {
        const getResponses = 'SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.in_response_to = $1';
        const id = req.params.id;
        pool.query(getResponses, [id], (error, results) => {
            if (error)
                throw error;
            return res.status(200).json(results.rows);
        });
    } catch (e) {
        return res.status(500);
    }
})

router.get('/old-comment/:id/', (req, res) => {
    try {
        const query = 'SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = $1 ORDER BY unnest DESC LIMIT 3) AND c.is_comment = true;';
        pool.query(query, [req.params.id], (error, result) => {
            if (error)
                res.status(400).json({msg: 'Error buscando último comentario'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
})

router.get('/all-comments/:id/', (req, res) => {
    try {
        const query = 'SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = $1) AND c.is_comment = true ORDER BY c.id;';
        pool.query(query, [req.params.id], (error, result) => {
            if (error)
                return res.status(400).json({msg: 'Error buscando último comentario'});
            res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/:id/', (req, res) => {
    try {
        const editChaptersQuery = 'UPDATE chapters SET body = $1 WHERE id = $2';
        const addChapterQuery = 'INSERT INTO chapters(body, writing_id) VALUES ($1, $2) RETURNING id;';
        const addChapterToWritingQuery = 'UPDATE writings SET chapters = array_append(chapters, $1) WHERE id = $2';
        const query = 'UPDATE writings SET title = $1, description = $2, genre = $3, tags = $4, completed = $5, body = $6, last_edited = now(), subgenre = $7 WHERE id = $8;';
        const chapters = req.body.chapters;
        if(chapters) {
            chapters.forEach(chapter => {
                if(chapter.id) {
                    pool.query(editChaptersQuery, [chapter.body, chapter.id], (error, result) => {
                        if(error)
                            throw error;
                    });
                } else {
                    pool.query(addChapterQuery, [chapter.body, req.params.id], (error, result) => {
                        if(error)
                            throw error;
                        pool.query(addChapterToWritingQuery, [parseInt(result.rows[0].id), req.params.id], (error, result) => {
                            if(error)
                                throw error;
                        });
                    });
                }
            })
        }
        const params = [req.body.title, req.body.description, req.body.genre, req.body.tags, req.body.completed, req.body.body, req.params.subgenre, req.params.id];
        pool.query(query, params, (error, result) => {
            if (error)
                throw error;
            res.status(200).json({msg: 'Escrito editado con exito'});
        });
    } catch (e) {
        return res.status(500);
    }
});

router.put('/chapter/:id/', (req, res) => {
   try {
       const query = 'UPDATE chapters SET body = $1 WHERE id = $2';
       const params = [req.body.body, req.params.id];
       pool.query(query, params, (error, result) => {
           if (error)
               throw error;
           return res.status(200).json({msg: 'Capitulo editado con exito'});
       });
   } catch (e) {
       return res.status(500);
   }
});

router.get('/compose-data/:id/', (req, res) => {
    try {
        const query = 'SELECT body, chapters, genre, description, title, id, subgenre, tags, completed, cover FROM writings WHERE id = $1;';
        pool.query(query, [req.params.id], (error, result) => {
            if (error)
                throw error;
            return res.status(200).json(result.rows[0]);
        });
    } catch (e) {
        return res.status(500);
    }
})


router.get('/comment/likers/:id/', (req, res) => {
    try {
        const query = 'SELECT username, profile_image FROM users WHERE id IN (SELECT unnest(likes) FROM commentitem WHERE id = $1);';
        pool.query(query, [req.params.id], (error, result) => {
            if (error) return res.status(402).json({msg: 'Error buscando likes del comentario'});
            return res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
})

router.delete('/comment/:id/writing/:wid/', (req, res) => {
   try {
       const query = 'DELETE FROM commentItem WHERE id = $1 RETURNING in_response_to, responses';
       const deleteFromWritingComments = 'UPDATE writings SET comments = array_remove(comments, $1) WHERE id = $2';
       const deleteFromParentComment = 'UPDATE commentItem SET responses = array_remove(responses, $1) WHERE id = $2;';
       pool.query(query, [req.params.id], (error, result) => {
           if (error || result.rows.length === 0) return res.status(402).json({msg: 'Error eliminando el comentario'});
           const parentCommentId = result.rows[0].in_response_to;
           const responses = result.rows[0].responses;
           pool.query(deleteFromWritingComments, [req.params.id, req.params.wid], (error, result) => {
               if (error) return res.status(402).json({msg: 'Error eliminando el comentario'});
               if (parentCommentId) {
                   pool.query(deleteFromParentComment, [req.params.id, parentCommentId], (error, result) => {
                       if (error) return res.status(402).json({msg: 'Error eliminando referencia del comentario'});
                   });
               }
               if (!responses || responses.length === 0) return res.status(200).json({msg: 'Comentario eliminado con éxito'});
               const ok = deleteRecursively(responses, req.params.wid);
               return ok ? res.status(200).json({msg: 'Comentario eliminado con éxito'}) : res.status(500).json({ msg: 'Ocurrio un error eliminando comentarios.' });
           });
       });
   } catch (e) {
       return res.status(500);
   }
});

const deleteRecursively = (responses, writingId) => {
    try {
        const getReponses = 'SELECT responses FROM commentItem WHERE id = $1;';
        const deleteFromWritingComments = 'UPDATE writings SET comments = array_remove(comments, $1) WHERE id = $2';
        if (!responses) return true;
        console.log(responses);
        responses.forEach(responseId => {
            let responsesFromCurrent = null;
            pool.query(getReponses, [responseId], (error, results) => {
                if(error) console.log(error);
                responsesFromCurrent = results.rows[0];
            });
            pool.query(deleteFromWritingComments, [responseId, writingId], (error, results) => {
                if(error) console.log(error);
                deleteRecursively(responsesFromCurrent, writingId);
            });
        })
    } catch (e) {
        console.log(e);
        return false;
    }
}

router.get('/:id/likers/', (req, res) => {
    try {
        const query = 'SELECT username, profile_image FROM users WHERE id IN (SELECT unnest(likes) FROM writings WHERE id = $1);';
        pool.query(query, [req.params.id], (error, result) => {
            if (error)
                return res.status(400).json({msg: 'Error buscando likers'});
            return res.status(200).json(result.rows);
        });
    } catch (e) {
        return res.status(500);
    }
})

module.exports = router;
