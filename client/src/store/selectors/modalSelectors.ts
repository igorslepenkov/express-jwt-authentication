import { createSelector } from "reselect";
import { IModalSlice } from "../slices";
import { RootState } from "../store";

const selectModalReducer = (state: RootState): IModalSlice => state.modal;

export const selectModalIsOpen = createSelector(
  [selectModalReducer],
  (modalState) => modalState.isOpen
);
