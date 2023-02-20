import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { registerUser, useAppDispatch, useAppSelector } from "../../store";
import { selectSessionIsLoading } from "../../store/selectors";
import { IRegisterUser } from "../../types";
import { emailRegex } from "../../utils";

interface IProps {
  isOpen: boolean;
  handleModal: () => void;
}

export const RegisterModal = ({ isOpen, handleModal }: IProps) => {
  const isSessionLoading = useAppSelector(selectSessionIsLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRegisterUser>();

  const dispath = useAppDispatch();

  const onSubmit = async (data: IRegisterUser) => {
    const result = await dispath(registerUser(data));
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
        <Typography variant="h4" component="div" color="secondary" sx={{ flexGrow: 1 }}>
          Register User
        </Typography>
        <Controller
          control={control}
          name="firstName"
          defaultValue=""
          rules={{
            required: "Please enter your first name",
            minLength: { value: 2, message: "Your name should be at least 2 characters long" },
          }}
          render={({ field }) => (
            <TextField
              label="First Name"
              variant="standard"
              type="text"
              {...field}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          defaultValue=""
          rules={{
            required: "Please enter your last name",
            minLength: { value: 2, message: "Your name should be at least 2 characters long" },
          }}
          render={({ field }) => (
            <TextField
              label="Last Name"
              variant="standard"
              type="text"
              {...field}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />

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

        <Button color="secondary" variant="contained" type="submit" size="large">
          {isSessionLoading ? <ClipLoader loading={isSessionLoading} color="#ffffff" /> : "Submit"}
        </Button>
      </Paper>
    </Modal>
  );
};
