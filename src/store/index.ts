import { getItemFromLocalStorage } from '@/lib/utils'
import { configureStore, createSlice } from '@reduxjs/toolkit'
const tableNameSlice = createSlice({
  name: '全局选中的table名称',
  initialState: "",
  reducers: {
    changeTableName: (state, action) => {
      return action.payload
    }
  }
})

const instanceNameSlice = createSlice({
  name: '全局选中instance名字',
  initialState: "OTS Table",
  reducers: {
    changeInstanceName: (state, action) => {
      return action.payload
    }
  }
})

const localInstances = getItemFromLocalStorage('data')?.instances || []

const instancesSlice = createSlice({
  name: '管理实例',
  initialState: localInstances as string[],
  reducers: {
    addInstance: (state, action) => {
      return [...state, action.payload]
    },
    getAllInstance: (state, action) => {
      return state
    },
    setInstances: (state, action) => {
      return action.payload;
    }
  }
})

const store = configureStore({
  reducer: {
    tableNameState: tableNameSlice.reducer,
    instanceNameState: instanceNameSlice.reducer,
    instancesState: instancesSlice.reducer
  }
})
export default store
export const tableNameSliceActions = tableNameSlice.actions
export const instanceNameSliceActions = instanceNameSlice.actions
export const instancesSliceActions = instancesSlice.actions
export type RootState = ReturnType<typeof store.getState>