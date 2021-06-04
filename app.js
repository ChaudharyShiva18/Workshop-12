const express = require("express");
const app = express();
app.use(express.json());
require("./db/conn");
const User = require("./model/schema");

app.post("/users", async (req, res) => {
  const { name, password } = req.body;
  const user = new User({ name, password });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});

app.get("/users", paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const searchvalue = String(req.query.searchValue);
    const selkey = req.query.selectionKey;
    const searchkey = req.query.searchKey;
    const startIndex = (skip - 1) * limit;
    const results = {};
    // // let n = selkey.length;
    // // let i;
    // // for (i = 0; i < n; i++) {
    // try {
    //   results.results = await User.find(
    //     { [searchkey]: { $regex: searchvalue } },
    //     { [selkey]: 1 }
    //   )
    //     .limit(limit)
    //     .skip(startIndex)
    //     .exec();
    //   res.paginatedResults = results;
    //   // console.log([selkey[i]]);
    //   next();
    // } catch (e) {
    //   res.status(500).json({ message: e.message });
    // }
    // // }
    try {
      results.results = await model
        .find({ [searchkey]: { $regex: searchvalue } }, { [selkey]: 1 })
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
app.listen(8000, () =>
  console.log("Server started on port http://localhost:8000")
);
