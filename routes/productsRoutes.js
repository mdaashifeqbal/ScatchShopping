const express = require("express");
const isOwnerLogin = require("../middleware/isOwnerLogin");
const upload = require("../middleware/multer-config");

const productsModel = require("../models/product-model");
const ownerModel = require("../models/owner-model");

const router = express.Router();

 

//owner create products post route api only for admin
router.post(
  "/createproducts",
  isOwnerLogin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, discount, bgcolor, panelcolor, textcolor } =
        req.body;

      const newProduct = new productsModel({
        image: req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
      });

      const owner = await ownerModel.findOne({ _id: req.owner.id });
      if (!owner) return res.status(404).redirect("/owners/ownerLogin");
      await newProduct.save();
      owner.products.push(newProduct._id);
      await owner.save();
      res.redirect("/owners/adminPanel");
    } catch (err) {
      res.send(err.message);
    }
  }
);

//admin delete products page route
router.get("/removeproducts", isOwnerLogin, async (req, res) => {
  const products = await productsModel.find();
  res.render("deleteproduct", { products });
});

//final delete post route
router.post("/removeproducts/:productId", isOwnerLogin, async (req, res) => {
  try {
    const productid = req.params.productId;
    await productsModel.findByIdAndDelete(productid);

    await ownerModel.updateOne(
      { _id: req.owner.id },
      { $pop: { products: 1 } } // removes the last element
    );

    res.redirect("/products/removeproducts");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
