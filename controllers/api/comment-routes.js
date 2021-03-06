const router = require('express').Router();
const { Comment, Activity, User, Vehicle, Event, Location, } = require('../../models');

// GET /api/comments
router.get('/', (req, res) => {
    Comment.findAll({ include: [{ all: true, nested: true }]})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/comments
router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        image: req.body.image,
        user_id: req.body.user_id,
        // event_id: req.body.event_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

// DELETE /api/comments/1
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;