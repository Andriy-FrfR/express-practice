const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Course = require('../models/course');

function mapCart(cart) {
  return cart.map((item) => {
    return {...item.courseId._doc, count: item.count};
  });
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total + course.count * course.price;
  }, 0);
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/cart');
});

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId');

  const courses = mapCart(user.cart.items);

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    courses,
    price: computePrice(courses)
  });
});

router.delete('/remove/:id', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId');

  await user.removeFromCart(req.params.id);

  const courses = mapCart(user.cart.items);

  res.json({price: computePrice(courses), courses, csrf: req.csrfToken()});
});

module.exports = router;
