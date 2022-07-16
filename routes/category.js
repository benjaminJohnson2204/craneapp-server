const router = require("express").Router();
const passport = require("passport");
const { getAllCategories, findCategoryById } = require("../db/services/category");

router.get("/all", async (req, res) => {
    let categories = await getAllCategories();
    res.json({categories : categories});
});

router.get("/:id", async (req, res) => {
   let category = await findCategoryById(req.params.id);
   res.json({category : category}); 
});


module.exports = router;