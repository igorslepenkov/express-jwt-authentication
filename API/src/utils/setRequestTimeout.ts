import { Response } from "express";

export const setRequestTimeout = (delayInSec: number, res: Response): void => {
  setTimeout(() => {
    if (!res.closed) {
      res.status(500).send({ error: "Unexpected timeout error" });
    }
  }, delayInSec * 1000);
};
