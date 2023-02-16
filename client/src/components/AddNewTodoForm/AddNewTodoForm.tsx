import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createTodo, useAppDispatch } from "../../store";
import { ICreateTodo } from "../../types";

interface IProps {
  closeForm: () => void;
}

export const AddNewTodoForm = ({ closeForm }: IProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateTodo>();

  const dispatch = useAppDispatch();

  const onSubmit = async (data: ICreateTodo) => {
    const result = await dispatch(createTodo(data));
    if (result.meta.requestStatus === "fulfilled") {
      reset();
      closeForm();
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={(theme) => ({
        maxWidth: "50vw",
        padding: "30px",
        margin: "auto",
        marginTop: "30vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "20px",
        [theme.breakpoints.down("md")]: {
          maxWidth: "80vw",
        },
      })}
    >
      <Typography variant="h4" component="div" color="secondary" sx={{ flexGrow: 1 }}>
        Add new todo
      </Typography>
      <Controller
        control={control}
        name="title"
        defaultValue=""
        rules={{
          required: "Please enter title",
          minLength: { value: 2, message: "Title should be at least 2 characters long" },
        }}
        render={({ field }) => (
          <TextField
            label="Title"
            variant="standard"
            type="text"
            {...field}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        defaultValue=""
        rules={{
          required: "Please enter description",
          minLength: { value: 10, message: "Description should be at least 10 characters long" },
        }}
        render={({ field }) => (
          <TextField
            label="Description"
            variant="standard"
            type="text"
            {...field}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Button color="secondary" variant="contained" type="submit" size="large">
        Submit
      </Button>

      <Button color="error" variant="contained" type="button" size="large" onClick={closeForm}>
        Cancel
      </Button>
    </Paper>
  );
};
