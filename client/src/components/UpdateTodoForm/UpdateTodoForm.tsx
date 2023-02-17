import { Button, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { Controller, useForm } from "react-hook-form";
import { updateTodo, useAppDispatch, useAppSelector } from "../../store";
import { selectTodos } from "../../store/selectors";
import { IUpdateTodo } from "../../types";

interface IProps {
  id: string;
  closeForm: () => void;
}

export const UpdateTodoForm = ({ id, closeForm }: IProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdateTodo>();

  const todos = useAppSelector(selectTodos);
  const todo = todos.find((todo) => todo.id === id);

  const dispatch = useAppDispatch();

  const onSubmit = async (data: IUpdateTodo) => {
    const result = await dispatch(updateTodo({ ...data, id }));
    if (result.meta.requestStatus === "fulfilled") {
      reset();
      closeForm();
    }
  };

  return (
    <ListItem alignItems="flex-start" component="form" onSubmit={handleSubmit(onSubmit)}>
      <ListItemText>
        <Controller
          control={control}
          name="title"
          defaultValue={todo?.title}
          rules={{
            required: "Please enter title",
            minLength: { value: 2, message: "Title should be at least 2 characters long" },
          }}
          render={({ field }) => (
            <TextField
              label="Title"
              variant="standard"
              size="small"
              fullWidth
              multiline
              type="text"
              {...field}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
      </ListItemText>
      <ListItemText>
        <Controller
          control={control}
          name="description"
          defaultValue={todo?.description}
          rules={{
            required: "Please enter description",
            minLength: { value: 10, message: "Description should be at least 10 characters long" },
          }}
          render={({ field }) => (
            <TextField
              label="Description"
              variant="standard"
              fullWidth
              multiline
              size="small"
              type="text"
              {...field}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </ListItemText>
      <Button color="secondary" variant="contained" type="submit" size="small">
        Submit
      </Button>

      <Button color="error" variant="contained" type="button" size="small" onClick={closeForm}>
        Cancel
      </Button>
    </ListItem>
  );
};
