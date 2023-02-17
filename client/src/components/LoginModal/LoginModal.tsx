import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { resolvePath } from "react-router-dom";
import { ROUTE } from "../../router";
import { loginUser, useAppDispatch } from "../../store";
import { ILoginUser } from "../../types";
import { emailRegex } from "../../utils";
import { LinkWithoutStyles } from "../LinkWithoutStyles";

interface IProps {
  isOpen: boolean;
  handleModal: () => void;
}

export const LoginModal = ({ isOpen, handleModal }: IProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginUser>();

  const dispath = useAppDispatch();

  const onSubmit = async (data: ILoginUser) => {
    const result = await dispath(loginUser(data));
    if (result.meta.requestStatus === "fulfilled") {
      reset();
      handleModal();
    }
  };

  const closeModal = () => {
    reset();
    handleModal();
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={(theme) => ({
          margin: "auto",
          marginTop: "30vh",
          maxWidth: "30vw",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          [theme.breakpoints.down("md")]: {
            maxWidth: "50vw",
          },
          [theme.breakpoints.down("sm")]: {
            maxWidth: "70vw",
          },
        })}
      >
        <Typography variant="h4" color="secondary">
          Login
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

        <Controller
          control={control}
          name="password"
          defaultValue=""
          rules={{
            required: "Please enter your password",
            minLength: {
              value: 6,
              message: "Your password must be at least 6 characters long",
            },
          }}
          render={({ field }) => (
            <TextField
              label="Password"
              variant="standard"
              type="password"
              {...field}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Box onClick={handleModal}>
          <LinkWithoutStyles to={resolvePath(ROUTE.ForgotPas, ROUTE.Users)}>
            <Typography
              variant="overline"
              color="primary"
              sx={{ margin: "30px 0", textDecoration: "underline" }}
            >
              Forgot Password
            </Typography>
          </LinkWithoutStyles>
        </Box>

        <Button color="secondary" variant="contained" type="submit" size="large">
          Submit
        </Button>
      </Paper>
    </Modal>
  );
};
