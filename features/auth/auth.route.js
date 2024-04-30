import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?status=failure",
  }),
  function (req, res) {
    console.log(req.user);
    res.redirect(
      `http://localhost:5173/login?status=success&token=${req.user}&auth=google`
    );
  }
);

export default router;
