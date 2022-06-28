const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

const OrderController = {
  create: async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    try {
      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
      });
      res.status(201).json({ success: true, order });
    } catch (err) {
      console.log("from create " + err);
    }
  },

  //Get internal server error 500 for backend code,console the error first
  myOrder: async (req, res, next) => {
    try {
      const myOrder = await Order.find({user:req.user._id});

      res.status(201).json({ success: true, myOrder });
    } catch (err) {
      console.log(err);
    }
  },

  getSingleOrder: async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );
      if (!order) {
        return res.status(400).json("Order not found with this id !");
      }

      res.status(201).json({ success: true, order });
    } catch (err) {
      console.log(err);
    }
  },

  getAllOrder: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const orders = await Order.find();
        let totalAmount = 0;
        let totalOrder = orders.length;

        orders.forEach((order) => {
          totalAmount += order.totalPrice;
        });

        res
          .status(201)
          .json({ success: true, totalOrder, totalAmount, orders });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json({msg:"You don't have access !"});
    }
  },

  updateOrder: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const order = await Order.findById(req.params.id);

        if (!order) {
          return res.status(400).json("Order not found with this id !");
        }

        if (order.orderStatus === "Delivered") {
          return res.status(400).json("Your order have already delivered !");
        }

        if (req.body.status === "Shipped") {
          order.orderItems.forEach(async (order) => {
            await updateStock(order.product, order.quantity);
          });
        }

        order.orderStatus = req.body.status;

        if (req.body.status === "Delivered") {
          order.deliveredAt = Date.now();
        }
        await order.save({ validateBeforeSave: false });
        res.status(201).json({ success: true });
      } catch (err) {
        console.log("from update " + err);
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You don't have access !");
    }
  },

  deleteOrder: async (req, res, next) => {
    if (req.user.role === "admin") {
      try {
        const order = await Order.findById(req.params.id);
        if (!order) {
          return res.status(400).json("Order not found with this id !");
        }
        await order.remove();
        res.status(201).json({ success: true, msg: "Order has deleted " });
      } catch (err) {
        console.log("from dltorder " + err);
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You don't have access !");
    }
  },
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

module.exports = OrderController;
