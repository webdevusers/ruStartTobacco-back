const express = require("express");
const router = express.Router();
const blog = require("../models/blog");

router.post("/create", async (req, res) => {
  try {
    const { showtitle, showdesc, images, textforpage } = req.body;
    const newBlog = await new blog({
      showtitle,
      showdesc,
      images,
      textforpage,
    }).save();

    res.json(newBlog);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const newBlog = await blog.findByIdAndRemove(req.params.id);

    if (!newBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(newBlog);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred", error: e.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const blogs = await blog.find();
    res.json(blogs);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
