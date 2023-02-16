import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ROUTE } from "../../router";
import { LinkWithoutStyles } from "../LinkWithoutStyles";

interface IProps {
  toggleRegisterModal: () => void;
  toggleLoginModal: () => void;
}

export const Header = ({ toggleRegisterModal, toggleLoginModal }: IProps) => {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <LinkWithoutStyles to={ROUTE.Home}>Express Todolist</LinkWithoutStyles>
        </Typography>

        <Button color="inherit" onClick={toggleRegisterModal}>
          Register
        </Button>
        <Button color="inherit" onClick={toggleLoginModal}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};
