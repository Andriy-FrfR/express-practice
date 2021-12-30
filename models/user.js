const {model, Schema} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = async function(course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(c => {
    return course._id.toString() === c.courseId.toString()
  });

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      courseId: course._id,
      count: 1
    });
  }

  this.cart = {items};

  return this.save();
}

userSchema.methods.removeFromCart = async function(id) {
  const idx = this.cart.items.findIndex((c) => {
    return c.courseId._id.toString() === id;
  });

  if (idx >= 0) {
    if (this.cart.items[idx].count > 1) {
      this.cart.items[idx].count--;
    } else {
      this.cart.items.splice(idx, 1);
    }
  }

  return this.save();
}

userSchema.methods.clearCart = async function() {
  this.cart.items = [];

  return this.save();
}

module.exports = model('User', userSchema);
