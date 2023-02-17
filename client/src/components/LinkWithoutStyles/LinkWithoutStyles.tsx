import { ReactNode } from "react";
import { Path } from "react-router-dom";

import { StyledLink } from "./style";

interface IProps {
  children: ReactNode;
  to: string | Path;
}

export const LinkWithoutStyles = ({ children, to }: IProps) => {
  return <StyledLink to={to}>{children}</StyledLink>;
};
