import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { App } from "../App";
import { Homepage, ForgotPasswordPage, ResetPasswordPage } from "../pages";
import { ROUTE } from "./routes";

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path={ROUTE.Home} element={<App />}>
      <Route index element={<Homepage />} />
      <Route path={ROUTE.Users}>
        <Route path={ROUTE.ForgotPas} element={<ForgotPasswordPage />} />
        <Route path={ROUTE.ResetPas} element={<ResetPasswordPage />} />
      </Route>
    </Route>
  )
);
