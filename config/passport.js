import passport from "passport";
import GoogleStrategy from "passport-google-oauth";

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,        
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, callback) {
      // TODO: Save user here
      console.log("GOOGLE USER ", profile);

      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
