

async function requireAuth(req, res, next) {
    // console.log('req', req);
    // console.log('req.cookies', req.cookies)
    // console.log('req.session.user', req.session.user);
    if (!req.session || (!req.session.user || !req.cookies.user)) {
        res.status(401).end('Unauthorized!');
        return;
    }
    next();
}



async function requireBeingMember(req, res, next) {
    // console.log('req', req);
    // console.log('req.cookies', req.cookies)
    req.session.user ?console.log('req.session.user._id', req.session.user._id) : console.log('no session user');
    req.cookies.user ? console.log('req.cookies.user._id', req.cookies.user._id): console.log('no cookie user');
    if ((req.session.user && req.cookies.user.rooms.includes(req.query.roomId)) || (req.session && req.session.user.rooms.includes(req.query.roomId))) {
        console.log('Approved! Approved! Approved! Approved! Approved!');
        next();
    }
    else {
        console.log('Unauthorized! Unauthorized! Unauthorized! Unauthorized!');
        res.status(401).end('Unauthorized!');
        return
    }
}


module.exports = {
    requireAuth,
    requireBeingMember
    // requireAdmin
}
