import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import resumeReducer from './resumeSlice'
import themeReducer from './themeSlice'
import uiReducer from './uiSlice'

// Strip undo/redo history arrays from persistence — they're large and ephemeral
const historyTransform = createTransform(
  (inboundState: unknown) => {
    const s = inboundState as Record<string, unknown>
    const { past: _past, future: _future, ...rest } = s
    return rest
  },
  (outboundState: unknown) => ({
    ...(outboundState as Record<string, unknown>),
    past: [],
    future: [],
  }),
  { whitelist: ['resume'] }
)

const persistConfig = {
  key: 'resume-v1',
  version: 1,
  storage,
  whitelist: ['theme'],
  transforms: [historyTransform],
}

const rootReducer = combineReducers({
  resume: resumeReducer,
  theme: themeReducer,
  ui: uiReducer,
})

// redux-persist types don't fully align with combineReducers — cast is safe here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedReducer = persistReducer(persistConfig, rootReducer as any)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
