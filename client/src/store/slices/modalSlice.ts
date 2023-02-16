import { createSlice } from "@reduxjs/toolkit";

export interface IModalSlice {
  isOpen: boolean;
}

const initialState: IModalSlice = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export default modalSlice.reducer;
export const { toggleModal } = modalSlice.actions;
