import { ErrorResponse } from "../utils/ErrorResponse";

export const errorHandler = (err: ErrorResponse, req: any, res: any, next: any) => {


    return res.status(err.statusCode).json({ error: err.message || 'AN UNEXPECTED ERROR OCCURED !!'});
};
