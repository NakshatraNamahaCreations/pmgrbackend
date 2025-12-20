import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

/**
 * GET ALL BLOGS (PUBLIC)
 * Optional query:
 *  - city
 *  - service
 */

router.post("/", async (req, res) => {
  try {
    const {
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      services,
      redirectLink,
      bannerImage,
      extraImage,
      faqs,
    } = req.body;

    const blog = await Blog.create({
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      services,
      redirectLink,
      bannerImage,
      extraImage,
      faqs,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { city, service } = req.query;

    const filter = {};

    if (city) {
      filter.city = city;
    }

    if (service) {
      filter.services = { $in: [service] };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "city title description metaTitle metaDescription bannerImage extraImage services redirectLink createdAt"
      );

    res.json({
      success: true,
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  const cleanedBlogs = blogs.map(blog => ({
  ...blog,
  description: blog.description.replace(/<[^>]*>/g, "").trim(),
}));

res.json({
  success: true,
  blogs: cleanedBlogs,
});
});

/**
 * GET SINGLE BLOG BY ID
 * (Useful if you don't use slugs)
 */
router.get("/id/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.get("/:city/:title", async (req, res) => {
  try {
    const city = req.params.city;
    const title = req.params.title.replace(/-/g, " ");

    const blog = await Blog.findOne({
      city: city,
      title: new RegExp(`^${title}$`, "i"),
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
