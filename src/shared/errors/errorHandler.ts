import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";


export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            message: "Validation error",
            errors: err.errors,
        });
    }

    console.error(err);

    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
}
