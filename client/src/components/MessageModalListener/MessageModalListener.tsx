import { useEffect } from "react";
import { useAppSelector } from "../../store";
import {
  selectSessionError,
  selectSessionIsLoading,
  selectSessionMessage,
  selectTodosError,
  selectTodosIsLoading,
  selectTodosMessage,
} from "../../store/selectors";
import { MessageModal } from "../MessageModal";

interface IProps {
  isOpen: boolean;
  toggleModal: () => void;
}

export const MessageModalListener = ({ isOpen, toggleModal }: IProps) => {
  const sessionIsLoading = useAppSelector(selectSessionIsLoading);
  const sessionError = useAppSelector(selectSessionError);
  const sessionMessage = useAppSelector(selectSessionMessage);
  const todosIsLoading = useAppSelector(selectTodosIsLoading);
  const todosError = useAppSelector(selectTodosError);
  const todosMesage = useAppSelector(selectTodosMessage);

  useEffect(() => {
    if (sessionIsLoading || todosIsLoading) {
      return;
    }

    if (sessionError || sessionMessage || todosError || todosMesage) toggleModal();
  }, [sessionError, sessionMessage, todosError, todosMesage, sessionIsLoading, todosIsLoading]);

  if (sessionError) {
    return (
      <MessageModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        status="Error"
        message={sessionError}
      />
    );
  }

  if (todosError) {
    return (
      <MessageModal isOpen={isOpen} toggleModal={toggleModal} status="Error" message={todosError} />
    );
  }

  if (todosMesage) {
    return (
      <MessageModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        status="Success"
        message={todosMesage}
      />
    );
  }

  if (sessionMessage) {
    return (
      <MessageModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        status="Success"
        message={sessionMessage}
      />
    );
  }

  return null;
};
