import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ROUTE } from "../../router";
import { LinkWithoutStyles } from "../LinkWithoutStyles";

export const Header = () => {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <LinkWithoutStyles to={ROUTE.Home}>Express Todolist</LinkWithoutStyles>
        </Typography>

        <Button color="inherit">Characters</Button>
        <Button color="inherit">Locations</Button>
        <Button color="inherit">Episodes</Button>
      </Toolbar>
    </AppBar>
  );
};
