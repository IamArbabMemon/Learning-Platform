export class ErrorResponse extends Error{
        public statusCode:number
    
        constructor(errorMessage:string,statusCode:number){
        super(errorMessage)
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

