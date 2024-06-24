import {configureStore } from '@reduxjs/toolkit'

import roomNumber from './roomNumber'

const store = configureStore({
    reducer: {
        roomNumber
    }
})

export default store