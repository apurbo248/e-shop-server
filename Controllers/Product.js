const Product = require("../model/productSchema");
const ApiFeatures = require("../Utils/apiFeatures");


const ProductController = {
  //create
  create: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const newProduct = new Product(req.body);

        await newProduct.save((error, product) => {
          if (error) return res.status(422).json("Fill all field");
          if (product) {
            res.status(201).json({ success: true, newProduct });
          }
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    } else {
      return res.status(403).json("You dont have an access !");
    }
  },
  //Update
  update: async (req, res) => {
    if (req.user.role === "admin") {
      try {
        const updateProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json({ success: true, updateProduct });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You dont have an access !");
    }
  },

  //delete
  delete: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(400).json("Product not found !");
        }
        await product.remove();
        res
          .status(200)
          .json({ success: true, msg: "Product hsa been deleted..." });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You dont have an access !");
    }
  },
  getAdminProduct: async (req, res, next) => {
    try {
      const products = await Product.find();

      if (!products) {
        return res.status(400).json("Product not found !");
      }
      res.status(201).json({  products });
     
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //GET ALL PRODUCT
  getAllProduct: async (req, res, next) => {
    try {
      const productPerPage = 6;
      const productCount = await Product.countDocuments();
      const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(productPerPage);

      const products = await apiFeatures.query;

      res.status(201).json({ productCount, products, productPerPage });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Get single product
  getSingleProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(400).json("Product not found !");
      }
      res.status(201).json({ success: true, product });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Create new review
  createReview: async (req, res, next) => {
    try {
      const { rating, comment, productId } = req.body;

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      const product = await Product.findById(productId);

      const isReviwed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id
      );

      if (isReviwed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
      } else {
        product.reviews.push(review);
        product.numberOfReview = product.reviews.length;
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      res.status(201).json("success");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET  PRODUCT REVIEW
  getProductReviews: async (req, res, next) => {
    try {
      const product = await Product.findById(req.query.id);
      if (!product) {
        res.status(404).json({ msg: "Product not found" });
      }
      res.status(201).json({ success: true, reviews: product.reviews });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE REVIEW
  deleteReview: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
          return res.status(404).json("Product not found");
        }
        const reviews = product.reviews.filter(
          (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach((rev) => {
          avg += rev.rating;
        });

        let ratings = 0;
        if (reviews.length === 0) {
          ratings = 0;
        } else {
          ratings = avg / reviews.length;
        }

        const numberOfReview = reviews.length;

        await Product.findByIdAndUpdate(
          req.query.productId,
          {
            reviews,
            ratings,
            numberOfReview,
          },
          {
            new: true,
            useFindAndModify: false,
          }
        );

        res.status(201).json({ success: true });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You dont have an access !");
    }
  },
};

module.exports = ProductController;
