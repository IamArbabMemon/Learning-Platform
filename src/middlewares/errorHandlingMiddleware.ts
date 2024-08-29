import { ErrorResponse } from "../utils/ErrorResponse";

export const errorHandler = (err: ErrorResponse, req: any, res: any, next: any) => {

        if(!err.statusCode)
            err.statusCode=500
    return res.status(err.statusCode).json({ error: err.message || 'AN UNEXPECTED ERROR OCCURED !!'});
};
