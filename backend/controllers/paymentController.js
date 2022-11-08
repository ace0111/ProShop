import { instance } from '../server.js'
import crypto from 'crypto'
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

export const checkout = asyncHandler(async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: 'INR',
  }
  const order = await instance.orders.create(options)

  res.status(200).json({
    success: true,
    order,
  })
})

export const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest('hex')

  const isAuthentic = expectedSignature === razorpay_signature

  if (isAuthentic) {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.razorpay_order_id,
        payment_id: req.body.razorpay_payment_id,
        status: req.body.status,
        update_time: Date.now(),
      }
    }
    const updatedOrder = await order.save()

    res
      .redirect(`http://localhost:3000/order/${req.params.id}`)
      .status(200)
      .json(updatedOrder)
  } else {
    res.status(400).json({
      success: false,
    })
  }
})
