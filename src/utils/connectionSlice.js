import { createSlice } from "@reduxjs/toolkit";
import { removeUser } from "./userSlice";

const connectionSlice = createSlice({
    name: 'connection',
    initialState: null,
    reducers: {
        addConnections: (state, action) => action.payload,
        removeConnections: () => null,
    },
    extraReducers: (builder) => {
        builder.addCase(removeUser, () => null);
    },
});

export const {addConnections, removeConnections} = connectionSlice.actions;

export default connectionSlice.reducer;





