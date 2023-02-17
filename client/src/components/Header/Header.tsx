import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ROUTE } from "../../router";
import { signOutUser, useAppDispatch, useAppSelector } from "../../store";
import { selectCurrentSession } from "../../store/selectors";
import { LinkWithoutStyles } from "../LinkWithoutStyles";

interface IProps {
  toggleRegisterModal: () => void;
  toggleLoginModal: () => void;
}

export const Header = ({ toggleRegisterModal, toggleLoginModal }: IProps) => {
  const currentSession = useAppSelector(selectCurrentSession);

  const dispatch = useAppDispatch();
  const signOut = () => {
    dispatch(signOutUser());
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <LinkWithoutStyles to={ROUTE.Home}>Express Todolist</LinkWithoutStyles>
        </Typography>

        {currentSession ? (
          <Button color="inherit" onClick={signOut}>
            Sign Out
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={toggleRegisterModal}>
              Register
            </Button>
            <Button color="inherit" onClick={toggleLoginModal}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
