import {app} from './app';
import { DBConnection } from './db/index';
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});

DBConnection().then(()=>{
    
    app.listen(process.env.PORT ||3000,()=>{
        console.log(`Server is listening on port ${process.env.PORT}`);
    });

}).catch(error =>{
   
    console.log("ERROR IN CONNECTING THE APP "+error.message)
    
});

