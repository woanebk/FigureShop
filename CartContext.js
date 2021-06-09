import React from 'react'
import { createContext } from 'react'

const CartContext = createContext({
    Cart: []
})

export default CartContext;