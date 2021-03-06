const router = require('express').Router();

//collect all of the main routes and package them up

const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard-routes.js');
const homeRoutes = require('./home-routes.js');

router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

router.use((req, res) => {
    res.send("<h1>Incorrect Route!</h1>")
});

module.exports = router;