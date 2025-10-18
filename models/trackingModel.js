const mongoose = require('mongoose')

const trackingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foods',
      required: true,
    },
    details: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
    },
    eatenDate: {
      type: String,
      // ⭐️ FIX: Define the default using a padded, consistent function
      default: () => {
        const now = new Date()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        return `${month}/${day}/${now.getFullYear()}`
      },
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { timestamps: true }
)

const trackingModel = mongoose.model('trackings', trackingSchema)

module.exports = trackingModel

// const mongoose = require('mongoose')

// const trackingSchema = mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'users',
//       required: true,
//     },
//     foodId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'foods',
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       min: 1,
//       required: true,
//     },
//   },
//   { timestamps: true }
// )

// const trackingModel = mongoose.model('trackings', trackingSchema)

// module.exports = trackingModel
