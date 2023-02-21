import { createSelector } from "reselect";
import { ISessionSlice } from "../slices";
import { RootState } from "../store";

const selectSessionReducer = (state: RootState): ISessionSlice => state.sessions;

export const selectCurrentSession = createSelector(
  [selectSessionReducer],
  (sessionState) => sessionState.session
);

export const selectSessionIsLoading = createSelector(
  [selectSessionReducer],
  (sessionState) => sessionState.isLoading
);

export const selectSessionError = createSelector(
  [selectSessionReducer],
  (sessionState) => sessionState.error
);

export const selectSessionMessage = createSelector(
  [selectSessionReducer],
  (sessionState) => sessionState.message
);
