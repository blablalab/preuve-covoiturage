const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const { PORT } = require("./config.js");
const Sentry = require("./sentry.js");

require("./passport")(passport);
require("./mongo");

const app = express();

// plugin Sentry - before other middlewares
app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(helmet());
app.use(cors());

app.use(passport.initialize());

// Route definitions
// auth is the middleware declared on each group of routes
const auth = passport.authenticate("jwt", { session: false });

app.use("/auth", require("./auth/authController"));
app.use("/users", auth, require("./users/userController"));
app.use("/aom", auth, require("./aom/aomController"));
app.use("/proofs", auth, require("./proofs/proofController"));
app.use("/stats", auth, require("./stats/statsController"));

// plugin Sentry error - after routes, before other middlewares
app.use(Sentry.Handlers.errorHandler());

// error handler - keep the next argument
// otherwise Express doesn't use it as error handler
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ error: err.message });
});

app.listen(PORT, () => console.log("Listening on port " + PORT));
