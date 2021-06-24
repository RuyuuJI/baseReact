import { createSlice } from '@reduxjs/toolkit'

export enum ThemeColorType { fontColor = "fontColor", backColor = "backColor" }
type ColorType = {
    [key in ThemeColorType]?: string
}
//
export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        [ThemeColorType.fontColor]: "#ebebeb",
        [ThemeColorType.backColor]: '#1b1b1b'
    } as ColorType,
    reducers: {
        changeColor: (state, action: { payload: { typename: ThemeColorType, value: string } }) => {
            const color = { ...state }
            const { payload } = action
            if (payload?.typename && payload?.value) color[payload.typename] = payload.value
            return { ...color }
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeColor } = themeSlice.actions

export default themeSlice.reducer