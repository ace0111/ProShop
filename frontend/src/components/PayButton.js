import React from 'react'
import { Button } from 'react-bootstrap'
const PayButton = ({ amount, checkoutHandler }) => {
  return (
    <Button
      type='button'
      className='btn btn-block'
      onClick={() => checkoutHandler(amount)}
    >
      Pay Now
    </Button>
  )
}

export default PayButton
