import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import ENV_CONFIG from "./env.config.js";
import userModel from "#server/models/user.model";

// google
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV_CONFIG.GOOGLE_CLIENT_ID,
      clientSecret: ENV_CONFIG.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV_CONFIG.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = profile._json;
      //   check email
      let user = await userModel.findOne({ email: body.email });

      if (!user) {
        user = await userModel.create({
          name: body.name,
          email: body.email,
          password: body.sub,
          providerGoogle: body.sub,
          avatar: body.picture,
        });
      }

      if (!user.providerGoogle) {
        user.providerGoogle = body.sub;
      }
      if (!user.avatar) {
        user.avatar = body.picture;
      }

      await user.save();

      done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
