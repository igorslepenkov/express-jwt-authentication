import { Modal, Paper, Typography } from "@mui/material";

interface IProps {
  isOpen: boolean;
  toggleModal: () => void;
  status: "Error" | "Success";
  message: string;
}

export const MessageModal = ({ isOpen, toggleModal, status, message }: IProps) => {
  return (
    <Modal open={isOpen} onClose={toggleModal}>
      <Paper
        component="div"
        sx={(theme) => ({
          margin: "auto",
          marginTop: "30vh",
          maxWidth: "30vw",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
          [theme.breakpoints.down("md")]: {
            maxWidth: "50vw",
          },
          [theme.breakpoints.down("sm")]: {
            maxWidth: "70vw",
          },
        })}
      >
        <Typography variant="h4" color={status === "Error" ? "red" : "green"}>
          {status}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ marginTop: "10px" }}>
          {message}
        </Typography>
      </Paper>
    </Modal>
  );
};
