const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const con = require('./model/user');

 function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        
        passport.serializeUser((user, done) => done(null, user))
        passport.deserializeUser((user, done) => {
            return done(null,user)
        })
        // const user = getUserByEmail(email)
        // if (user == null) {
        //     return done(null, {message : 'no user with the email'})
        // }
        // try {
        //     if(await bcrypt.compare(password, user.password)){
        //         return done(null, user)
        //     }
        //     else {
        //         return done(null, false, {message : 'Password Incorrect'})
        //     }
        // } catch (error) {
        //     return done(error)
        // }
        const user = con.query("SELECT * FROM `user` WHERE `email` = '" + email + "'",async function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, {message : 'no user with the email'}); // req.flash is the way to set flashdata using connect-flash
            } 
            
            //if user is found but not confirmed

			// if the user is found but the password is wrong
            if (!( await bcrypt.compare(password, rows[0].password)))
                return done(null, false, {message : 'Password Incorrect'}); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, rows[0]);			
		});
		
    }
    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
}

module.exports = initialize