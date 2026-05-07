import { createContext, useContext } from 'react'

export const DragHandleContext = createContext<React.ReactNode>(null)

export function useDragHandle() {
  return useContext(DragHandleContext)
}
