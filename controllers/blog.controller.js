import Blog from "../models/Blog.js";

/**
 * GET ALL BLOGS (PUBLIC)
 */
export const getAllBlogs = async (req, res) => {
  try {
    const { city, service } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (service) filter.services = { $in: [service] };

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "city title metaTitle metaDescription bannerImage extraImage services redirectLink createdAt"
      );

    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET BLOG BY ID (PUBLIC)
 */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET BLOG BY CITY + TITLE
 */
export const getBlogByCityAndTitle = async (req, res) => {
  try {
    const city = req.params.city;
    const title = req.params.title.replace(/-/g, " ");

    const blog = await Blog.findOne({
      city,
      title: new RegExp(`^${title}$`, "i"),
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
