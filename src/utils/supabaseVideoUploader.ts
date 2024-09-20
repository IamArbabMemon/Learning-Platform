import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
// import fs from 'fs/promises'
import { promises as fs } from 'fs';
dotenv.config({path:'./.env'});

let supabaseVideoUploader:any;
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
if(supabaseUrl && supabaseKey)
 supabaseVideoUploader = createClient(supabaseUrl, supabaseKey);

const uploadVideoOnSupabaseStorage = async(videoPath:string,fileName:string)=>{
    try {
        // Read the video file from the local filesystem
        const videoBuffer = await fs.readFile(videoPath);
    
        // Upload the video file to Supabase storage bucket
        const { data, error } = await supabaseVideoUploader
          .storage
          .from('Videos')
          .upload('lesson1/', videoBuffer, {
            contentType: 'video/mp4',
            cacheControl: '3600', // Cache for 1 hour
            upsert: false, // Do not overwrite existing files
          });
    
        if (error) {
          throw error;
        }
    
        console.log('Video uploaded successfully:', data);
        return data;
    
      } catch (error) {
        console.error('Error uploading video:', error.message);
        throw error;
      }
}


export {
    supabaseVideoUploader
}