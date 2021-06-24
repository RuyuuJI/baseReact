import { configureStore } from '@reduxjs/toolkit'
import theme from './global/theme'

export default configureStore({
    reducer: {
        theme
    },
})