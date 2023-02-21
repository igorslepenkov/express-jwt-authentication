import { useState } from "react";

import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ITodo } from "../../types";
import { deleteTodo, useAppDispatch } from "../../store";
import { useToggle } from "../../hook";
import { UpdateTodoForm } from "../UpdateTodoForm";

interface IProps {
  todo: ITodo;
}

export const TodoItem = ({ todo }: IProps) => {
  const [isUpdateTodoFormOpen, toggleUpdateTodoForm] = useToggle();

  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    const itemId = event.currentTarget.dataset["item"];
    if (itemId) {
      dispatch(deleteTodo(itemId));
    }
  };

  const popoverOpen = !!anchorEl;

  if (isUpdateTodoFormOpen) {
    return <UpdateTodoForm id={todo.id} closeForm={toggleUpdateTodoForm} />;
  }

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton edge="start" onClick={toggleUpdateTodoForm}>
            <EditIcon />
          </IconButton>

          <IconButton edge="end" data-item={todo.id} onClick={deleteItem}>
            <DeleteIcon />
          </IconButton>
        </>
      }
      disablePadding
    >
      <ListItemButton role={undefined} onClick={handleClick} dense>
        <ListItemIcon>
          <ExpandMoreIcon />
        </ListItemIcon>
        <ListItemText
          id={todo.id}
          primary={todo.title}
          secondary={todo.description.slice(0, 50) + "..."}
        />
      </ListItemButton>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2, maxWidth: "50vw", wordWrap: "break-word" }}>
          {todo.description}
        </Typography>
      </Popover>
    </ListItem>
  );
};
