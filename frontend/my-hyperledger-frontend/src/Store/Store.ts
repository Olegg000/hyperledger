import {configureStore,createSlice,PayloadAction} from '@reduxjs/toolkit'
import {Bank, Users} from "../Type/Types"

const initialState = {
    user: {} as Users,
    bank: {} as Bank
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState.user,
    reducers: {
        setUser: (state, action: PayloadAction<Users>) => {
            state.login = action.payload.login
            state.password = action.payload.password
            state.balancePC = action.payload.balancePC
            state.isDPS = action.payload.isDPS
            state.fio = action.payload?.fio
            state.licence = action.payload?.licence
            state.licence2 = action.payload?.licence2
            state.skillYears = action.payload?.skillYears
            state.car = action.payload?.car
        },
        delUser: (state) => {
            state.login = ""
            state.password = ""
            state.balancePC = "0"
            state.isDPS = false
            state.fio = undefined
            state.licence = undefined
            state.skillYears = ""
            state.car = undefined
        }
    }
})

const bankSlice = createSlice({
    name: "bankAuth",
    initialState: initialState.bank,
    reducers: {
        setBank: (state, action: PayloadAction<string>) => {
            state.balancePC = action.payload
        },
        delBank: (state) => {
            state.balancePC = undefined
        }
    }
})

export const {setUser} = authSlice.actions;
export const {delUser} = authSlice.actions;
export const {setBank} = bankSlice.actions;
export const {delBank} = bankSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        bank: bankSlice.reducer,
    }
})

export type RStore = ReturnType<typeof store.getState>

export {store}
