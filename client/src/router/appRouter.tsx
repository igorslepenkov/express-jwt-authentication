import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { App } from "../App";
import { Homepage } from "../pages";
import { ROUTE } from "./routes";

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path={ROUTE.Home} element={<App />}>
      <Route index element={<Homepage />} />
    </Route>
  )
);
