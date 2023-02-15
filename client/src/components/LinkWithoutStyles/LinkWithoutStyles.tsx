import { ReactNode } from "react";

import { StyledLink } from "./style";

interface IProps {
  children: ReactNode;
  to: string;
}

export const LinkWithoutStyles = ({ children, to }: IProps) => {
  return <StyledLink to={to}>{children}</StyledLink>;
};
