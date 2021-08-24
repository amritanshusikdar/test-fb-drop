import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
    return res.status(400).json({ message: "Login route!" });
};
