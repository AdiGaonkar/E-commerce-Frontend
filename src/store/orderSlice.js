import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  order: [],        // user orders
  adminOrders: []   // admin orders
};

const orderSlice = createSlice({
  name: "orders",
  initialState: initialValue,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setAdminOrders: (state, action) => {
      state.adminOrders = action.payload;
    }
  }
});

export const { setOrder, setAdminOrders } = orderSlice.actions;

export default orderSlice.reducer;
