import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header, MessageModalListener, RegisterModal, LoginModal } from "./components";
import { useToggle } from "./hook";
import { useAppSelector, toggleModal, useAppDispatch } from "./store";
import { selectModalIsOpen } from "./store/selectors";

export const App = () => {
  const dispatch = useAppDispatch();

  const [isRegisterModalOpen, toggleRegisterModalOpen] = useToggle();
  const [isLoginModalOpen, toggleLoginModalOpen] = useToggle();

  const isModalOpen = useAppSelector(selectModalIsOpen);
  const toggleMessageModal = () => {
    dispatch(toggleModal());
  };

  return (
    <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        toggleRegisterModal={toggleRegisterModalOpen}
        toggleLoginModal={toggleLoginModalOpen}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <RegisterModal isOpen={isRegisterModalOpen} handleModal={toggleRegisterModalOpen} />
      <LoginModal isOpen={isLoginModalOpen} handleModal={toggleLoginModalOpen} />
      <MessageModalListener isOpen={isModalOpen} toggleModal={toggleMessageModal} />
    </Container>
  );
};
