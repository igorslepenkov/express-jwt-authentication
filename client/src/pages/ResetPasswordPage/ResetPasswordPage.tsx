import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE } from "../../router";
import { resetPassword, useAppDispatch } from "../../store";
import { IResetPassword } from "../../types";

export const ResetPasswordPage = () => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<IResetPassword & { confirm: string }>();

  const { token } = useParams();

  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({ newPassword, confirm }: IResetPassword & { confirm: string }) => {
    if (token) {
      if (newPassword !== confirm) {
        setError("confirm", { message: "Confirmation does not match original password" });
        return;
      }

      const result = await dispath(resetPassword({ newPassword, token }));
      if (result.meta.requestStatus === "fulfilled") {
        reset();
        navigate(ROUTE.Home);
      }
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
        Reset Password
      </Typography>
      <Controller
        control={control}
        name="newPassword"
        defaultValue=""
        rules={{
          required: "Please enter your password",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        }}
        render={({ field }) => (
          <TextField
            label="New Password"
            variant="standard"
            type="password"
            {...field}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirm"
        defaultValue=""
        rules={{
          required: "Please confirm your password",
        }}
        render={({ field }) => (
          <TextField
            label="Confirm Password"
            variant="standard"
            type="password"
            {...field}
            error={!!errors.confirm}
            helperText={errors.confirm?.message}
          />
        )}
      />
      <Button color="secondary" variant="contained" type="submit" size="large">
        Submit
      </Button>
    </Paper>
  );
};
