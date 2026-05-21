import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import {
  FONT_OPTIONS,
  setAccentColor, setHeaderBg, setFontFamily,
  setTemplateId, setDensity, setPhotoShape,
  setHeadingStyle, setNameSize, setColumnRatio,
  applyPreset, setSectionOrder, setPdfBg, resetTheme,
} from '@/store/themeSlice'
import type { FontFamily, TemplateId, Density, PhotoShape, HeadingStyle, NameSize, ACCENT_PRESETS } from '@/store/themeSlice'

export function useTheme() {
  const theme = useSelector((state: RootState) => state.theme)
  const dispatch = useDispatch<AppDispatch>()

  const fontCss = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)?.css
    ?? 'var(--font-geist-sans), system-ui, sans-serif'

  return {
    theme,
    fontCss,
    setAccentColor:  (color: string)        => dispatch(setAccentColor(color)),
    setHeaderBg:     (color: string)        => dispatch(setHeaderBg(color)),
    setFontFamily:   (font: FontFamily)     => dispatch(setFontFamily(font)),
    setTemplateId:   (id: TemplateId)       => dispatch(setTemplateId(id)),
    setDensity:      (d: Density)           => dispatch(setDensity(d)),
    setPhotoShape:   (s: PhotoShape)        => dispatch(setPhotoShape(s)),
    setHeadingStyle:  (s: HeadingStyle)      => dispatch(setHeadingStyle(s)),
    setNameSize:      (s: NameSize)          => dispatch(setNameSize(s)),
    setColumnRatio:   (n: number)            => dispatch(setColumnRatio(n)),
    applyPreset:     (preset: (typeof ACCENT_PRESETS)[number]) => dispatch(applyPreset(preset)),
    setSectionOrder: (order: string[])      => dispatch(setSectionOrder(order)),
    setPdfBg:        (bg: 'light' | 'dark') => dispatch(setPdfBg(bg)),
    resetTheme:      ()                     => dispatch(resetTheme()),
  }
}
