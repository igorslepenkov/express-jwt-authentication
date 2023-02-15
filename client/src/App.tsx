import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "./components";

export const App = () => {
  return (
    <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Outlet />
    </Container>
  );
};
