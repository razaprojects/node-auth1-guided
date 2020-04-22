const bcrypt = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      res.status(500).json({ message: "problem with db", error: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username;
        res.status(200).json({ message: "Wecome!" });
      } else {
        res.status(401).json({ message: "invalid creds" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "problem with db", error: err });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("unable to lgout");
    } else {
      res.send("logged out");
    }
  });
});

module.exports = router;
