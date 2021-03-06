const router = require('express').Router();
const { User, Activity, Vehicle, Comment, Event, Location, } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method to find all users
    User.findAll({
        include: [{ all: true, nested: true }]
        // attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // confirm how many times a user visits page
    if (!req.session.views) {
        req.session.views = 1;
        console.log('This is your first visit')
    } else {
        req.session.views++
        console.log(`You have visited ${req.session.views} times`)
    }
    // Query operation to find one user
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [{
            model: Activity,
            attributes: ['activity_name', 'type', 'category', 'style', 'license_required', 'risk_level', 'fee', 'equipment', 'season', 'max_participants', 'min_participants', 'user_id']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'image', 'created_at'],
            include: {
                model: Activity,
                attributes: ['activity_name', 'type', 'category', 'style', 'fee', 'season'],
                through: Location
            }
        },
        {
            model: Vehicle,
            attributes: ['driver_id'],
            through: User
        }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // Query operation to create a user
    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.first_name = dbUserData.first_name;
                req.session.last_name = dbUserData.last_name;
                req.session.email = dbUserData.email;
                req.session.password = dbUserData.password;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
});

// POST /api/login
router.post('/login', (req, res) => {
    console.log("-------- user-routes.js ---router.post('/login', (req, res) =>--- request: ", req.body);

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            console.log("-------- user-routes.js ---No user with that email!--- dbUserData: ", dbUserData);
            res.status(418).json({ message: 'No user with that email!' });
            return;
        }

        console.log('-------- user-routes.js ---checkPassword--- dbUserData: ', dbUserData);
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        console.log('---(((((((( PASSWORD GOOD (((((((((',req.session);

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.first_name = dbUserData.first_name;
            req.session.last_name = dbUserData.last_name;
            req.session.email = dbUserData.email;
            req.session.password = dbUserData.password;
        req.session.loggedIn = true;
            console.log('-------- SESSION CREATED -------===((',req.session);
            let sessionInfo = req.session;
            res.render('dashboard', {
                sessionInfo
              });            // res.json({ user: dbUserData, message: 'You are now logged in!' });

        });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        console.log("***********************router.post('/logout', (req, res) =>**************************")
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
module.exports = router;