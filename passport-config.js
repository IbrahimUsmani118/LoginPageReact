const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, authenticateUser)
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = getUserById(id);
        done(null, user);
    });
}

module.exports = initialize;