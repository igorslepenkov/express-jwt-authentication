import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../router";
import { forgotPassword, useAppDispatch } from "../../store";
import { IForgotPassword } from "../../types";
import { emailRegex } from "../../utils";

export const ForgotPasswordPage = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IForgotPassword>();

  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: IForgotPassword) => {
    const result = await dispath(forgotPassword(data));
    if (result.meta.requestStatus === "fulfilled") {
      reset();
      navigate(ROUTE.Home);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={(theme) => ({
        margin: "auto",
        marginTop: "30vh",
        maxWidth: "40vw",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        [theme.breakpoints.down("md")]: {
          maxWidth: "60vw",
        },
        [theme.breakpoints.down("sm")]: {
          maxWidth: "80vw",
        },
      })}
    >
      <Typography variant="h4" color="secondary">
        Email to send verification message
      </Typography>
      <Controller
        control={control}
        name="email"
        defaultValue=""
        rules={{
          required: "Please enter your email",
          pattern: {
            value: emailRegex,
            message: "It seems that you have entered invalid email",
          },
        }}
        render={({ field }) => (
          <TextField
            label="Email Name"
            variant="standard"
            type="email"
            {...field}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Button color="secondary" variant="contained" type="submit" size="large">
        Submit
      </Button>
    </Paper>
  );
};
