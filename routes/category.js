const router = require("express").Router();
const passport = require("passport");
const { getAllCategories } = require("../db/services/category");

router.get("/all", async (req, res) => {
  let categories = await getAllCategories();
  res.json({ categories: categories });
});

module.exports = router;
