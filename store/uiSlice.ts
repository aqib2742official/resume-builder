import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  mobileTab: 'editor' | 'preview'
  collapsedSections: string[]
  darkEditor: boolean
  darkMode: boolean
  mobileSheetOpen: boolean
}

const initialState: UIState = {
  mobileTab: 'editor',
  collapsedSections: [],
  darkEditor: false,
  darkMode: false,
  mobileSheetOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileTab(state, action: PayloadAction<'editor' | 'preview'>) {
      state.mobileTab = action.payload
    },
    toggleSection(state, action: PayloadAction<string>) {
      const key = action.payload
      const index = state.collapsedSections.indexOf(key)
      if (index === -1) state.collapsedSections.push(key)
      else state.collapsedSections.splice(index, 1)
    },
    expandSection(state, action: PayloadAction<string>) {
      state.collapsedSections = state.collapsedSections.filter((k) => k !== action.payload)
    },
    toggleDarkEditor(state) {
      state.darkEditor = !state.darkEditor
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
    },
    setMobileSheetOpen(state, action: PayloadAction<boolean>) {
      state.mobileSheetOpen = action.payload
    },
  },
})

export const { setMobileTab, toggleSection, expandSection, toggleDarkEditor, toggleDarkMode, setMobileSheetOpen } = uiSlice.actions
export default uiSlice.reducer
