const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');

router.get('', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      'user.userId': req.user._id
    }).populate('user.userId');

    res.render('orders', {
      isOrders: true,
      title: 'Заказы',
      orders: orders.map((order) => {
        return {
          ...order._doc,
          price: order.courses.reduce((total, course) => {
            return total + course.count * course.course.price;
          }, 0)
        }
      })
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId');

    const courses = user.cart.items.map((item) => {
      return {course: {...item.courseId._doc}, count: item.count};
    });

    const order = new Order({
      courses,
      user: {
        name: req.user.name,
        userId: req.user
      }
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
