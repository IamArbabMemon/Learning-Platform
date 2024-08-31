import {z} from 'zod';

const schema = z.object({
   username:z.string().min(3),
   email:z.string(),
   password:z.string(),
   first_name:z.string(),
   last_name:z.string(),
   //date_of_birth:z.date(),
   bio:z.string(),
   contact_number:z.string().min(11).max(11),
   country:z.string(),
   role:z.string()
});

export {
    schema
}