import passport from "passport";
import GoogleStrategy from "passport-google-oauth";
import jwtSign from "../utils/jwtSign.js";
import { StringValue } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, callback) {
      var params = [
        StringValue({ fieldName: "Email", value: profile.emails[0].value }),
      ];

      let userLoginResult = await executeSp({
        spName: `UserGetByEmail`,
        params: params,
      });

      userLoginResult = userLoginResult.recordsets[0][0];

      let token = jwtSign(
        {
          userId: userLoginResult.Id,
          username: userLoginResult.Username,
        },        
      );

      callback(null, token);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
