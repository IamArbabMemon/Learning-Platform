 import dotenv from 'dotenv';
 import {app} from './app';
import { DBConnection } from './db/index';
import { redisClient } from './db/redisClient';
dotenv.config({
    path: './.env'
})

DBConnection().then(()=>{
    

    redisClient.connect().then(()=>{

        app.listen(process.env.PORT ||3000,()=>{
            console.log(`Server is listening on port ${process.env.PORT}`);
        });

    }).catch((err) => {
            console.error('Failed to connect to Redis:', err);

    });
     
    
}).catch(error =>{
   
    console.log("ERROR IN CONNECTING THE APP "+error.message)
    
});

