import { Fragment, useEffect } from "react";

import { Paper, List, Divider } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { fetchTodos, useAppDispatch, useAppSelector } from "../../store";
import { selectCurrentSession, selectTodos } from "../../store/selectors";
import { TodoItem } from "../TodoItem";

interface IProps {
  toggleAddForm: () => void;
}

export const TodoList = ({ toggleAddForm }: IProps) => {
  const currentSession = useAppSelector(selectCurrentSession);
  const todos = useAppSelector(selectTodos);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentSession) {
      dispatch(fetchTodos());
    }
  }, [currentSession]);

  return (
    <List>
      <Paper sx={{ textAlign: "center", padding: "30px" }}>
        {todos.length === 0 && (
          <Typography variant="h5" color="info">
            There are nothing to do at the moment
          </Typography>
        )}
        {todos.map((todo) => (
          <Fragment key={todo.id}>
            <TodoItem todo={todo} />
            <Divider />
          </Fragment>
        ))}
        <Button variant="contained" sx={{ marginTop: "10px" }} onClick={toggleAddForm}>
          Add todo
        </Button>
      </Paper>
    </List>
  );
};
