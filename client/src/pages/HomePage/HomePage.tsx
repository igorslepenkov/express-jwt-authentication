import { Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { TodoList } from "../../components";
import { AddNewTodoForm } from "../../components/AddNewTodoForm";
import { useToggle } from "../../hook";
import { useAppSelector } from "../../store";
import { selectCurrentSession } from "../../store/selectors";

export const Homepage = () => {
  const currentSession = useAppSelector(selectCurrentSession);

  const [isAddNewTodoFormOpen, toggleAddNewTodoForm] = useToggle();

  if (!currentSession) {
    return (
      <Paper
        sx={(theme) => ({
          maxWidth: "50vw",
          margin: "auto",
          marginTop: "30vh",
          padding: "30px",
          textAlign: "center",
          [theme.breakpoints.down("md")]: {
            maxWidth: "70vw",
          },
        })}
      >
        <Typography variant="h4" color="primary">
          Welcome to express todolist!
        </Typography>
        <Typography variant="h5" color="secondary" sx={{ marginTop: "10px" }}>
          To continue please register / sign in
        </Typography>
      </Paper>
    );
  }

  if (isAddNewTodoFormOpen) {
    return <AddNewTodoForm closeForm={toggleAddNewTodoForm} />;
  }

  return (
    <Container
      sx={(theme) => ({
        maxWidth: "70vw",
        margin: "auto",
        [theme.breakpoints.down("sm")]: { maxWidth: "90vw" },
      })}
    >
      <Typography variant="h4" color="darkBlue" sx={{ margin: "30px 0" }}>
        Todo List:
      </Typography>
      <TodoList toggleAddForm={toggleAddNewTodoForm} />
    </Container>
  );
};
