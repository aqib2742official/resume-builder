import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FontFamily   = 'geist' | 'inter' | 'roboto' | 'playfair' | 'georgia'
export type TemplateId   = 'two-column' | 'minimal'
export type Density      = 'compact' | 'standard' | 'spacious'
export type PhotoShape   = 'circle' | 'square' | 'none'
export type HeadingStyle = 'underline' | 'leftbar' | 'plain' | 'filled'
export type NameSize     = 'normal' | 'large' | 'xlarge'

export interface ResumeTheme {
  accentColor: string
  headerBg: string
  fontFamily: FontFamily
  templateId: TemplateId
  density: Density
  photoShape: PhotoShape
  headingStyle: HeadingStyle
  nameSize: NameSize
  columnRatio: number   // left column %, range 30–70
}

const initialState: ResumeTheme = {
  accentColor: '#1e3a5f',
  headerBg: '#1e3a5f',
  fontFamily: 'geist',
  templateId: 'two-column',
  density: 'standard',
  photoShape: 'circle',
  headingStyle: 'underline',
  nameSize: 'normal',
  columnRatio: 60,
}

export const ACCENT_PRESETS = [
  { name: 'Navy',    accent: '#1e3a5f', header: '#1e3a5f' },
  { name: 'Ocean',   accent: '#2563eb', header: '#1d4ed8' },
  { name: 'Violet',  accent: '#7c3aed', header: '#6d28d9' },
  { name: 'Emerald', accent: '#059669', header: '#047857' },
  { name: 'Rose',    accent: '#e11d48', header: '#be123c' },
  { name: 'Slate',   accent: '#475569', header: '#334155' },
  { name: 'Amber',   accent: '#b45309', header: '#92400e' },
  { name: 'Teal',    accent: '#0f766e', header: '#115e59' },
]

export const FONT_OPTIONS: { name: string; value: FontFamily; css: string }[] = [
  { name: 'Geist',    value: 'geist',    css: 'var(--font-geist-sans), system-ui, sans-serif' },
  { name: 'Inter',    value: 'inter',    css: 'var(--font-inter), system-ui, sans-serif' },
  { name: 'Roboto',   value: 'roboto',   css: 'var(--font-roboto), system-ui, sans-serif' },
  { name: 'Playfair', value: 'playfair', css: 'var(--font-playfair), Georgia, serif' },
  { name: 'Georgia',  value: 'georgia',  css: 'Georgia, Times New Roman, serif' },
]

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setAccentColor(state, action: PayloadAction<string>) { state.accentColor = action.payload },
    setHeaderBg(state, action: PayloadAction<string>) { state.headerBg = action.payload },
    setFontFamily(state, action: PayloadAction<FontFamily>) { state.fontFamily = action.payload },
    setTemplateId(state, action: PayloadAction<TemplateId>) { state.templateId = action.payload },
    setDensity(state, action: PayloadAction<Density>) { state.density = action.payload },
    setPhotoShape(state, action: PayloadAction<PhotoShape>) { state.photoShape = action.payload },
    setHeadingStyle(state, action: PayloadAction<HeadingStyle>) { state.headingStyle = action.payload },
    setNameSize(state, action: PayloadAction<NameSize>) { state.nameSize = action.payload },
    setColumnRatio(state, action: PayloadAction<number>) {
      state.columnRatio = Math.max(30, Math.min(70, action.payload))
    },
    applyPreset(state, action: PayloadAction<(typeof ACCENT_PRESETS)[0]>) {
      state.accentColor = action.payload.accent
      state.headerBg = action.payload.header
    },
    resetTheme() { return initialState },
  },
})

export const {
  setAccentColor, setHeaderBg, setFontFamily,
  setTemplateId, setDensity, setPhotoShape,
  setHeadingStyle, setNameSize, setColumnRatio,
  applyPreset, resetTheme,
} = themeSlice.actions

export default themeSlice.reducer
