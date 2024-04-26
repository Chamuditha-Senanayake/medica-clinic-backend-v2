import passport from "passport";
import GoogleStrategy from "passport-google-oauth";

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID:
        "1063756386208-5qp0ipodinc43somng1098krg1j4l3no.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:9000/api/v1/auth/google/callback",
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
