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
/*
 
interface IStudent extends Document {
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date; // Optional
  profile_picture?: string; // Optional
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive' | 'suspended';
  bio?: string; // Optional
  contact_number?: string; // Optional
  country:string
}


 */