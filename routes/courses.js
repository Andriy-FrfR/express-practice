const {Router} = require('express');
const auth = require('../middleware/auth');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  });
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  console.log(course);
  res.render('course', {
    layout: 'empty',
    course,
    title: `Курс`
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  const course = await Course.findById(req.params.id);

  res.render('edit', {
    course,
    title: `Редактировать ${course.title}`
  });
});

router.post('/:id/edit', auth, async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, req.body);

  res.redirect('/courses');
});

router.post('/:id/remove', auth, async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.params.id);
    res.redirect('/courses');
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
