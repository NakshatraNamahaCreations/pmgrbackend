import Blog from "../models/Blog.js";

/**
 * CREATE BLOG
 */
export const createBlog = async (req, res) => {
  try {
    const {
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      services,
      faqs,
      redirectLink,
    } = req.body;

    const blog = new Blog({
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      redirectLink,
      createdBy: req.adminId || null,
      services: services ? JSON.parse(services) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      bannerImage: req.files?.bannerImage?.[0]?.path || "",
      extraImage: req.files?.extraImage?.[0]?.path || "",
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET ALL BLOGS (ADMIN)
 */
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET SINGLE BLOG (ADMIN)
 */
export const getBlogByIdAdmin = async (req, res) => {
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
 * UPDATE BLOG
 */
export const updateBlog = async (req, res) => {
  try {
    const {
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      services,
      faqs,
      redirectLink,
    } = req.body;

    const updateData = {
      city,
      title,
      metaTitle,
      metaDescription,
      description,
      redirectLink,
      updatedAt: Date.now(),
    };

    if (services) updateData.services = JSON.parse(services);
    if (faqs) updateData.faqs = JSON.parse(faqs);

    if (req.files?.bannerImage)
      updateData.bannerImage = req.files.bannerImage[0].path;

    if (req.files?.extraImage)
      updateData.extraImage = req.files.extraImage[0].path;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE BLOG
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
