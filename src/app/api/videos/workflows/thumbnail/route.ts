import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType{
  userId:string;
  videoId:string;
  prompt:string;
}


export const { POST } = serve(
  async (context) => {
    const utapi = new UTApi();
    const input = context.requestPayload as InputType;
    const {videoId, userId,prompt} = input;
    const video = await context.run("get-video",async () => {
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(
          eq(videos.id,videoId),
          eq(videos.userId, userId)
        ))
        if(!existingVideo){
          throw new Error("Not found")
        }
        return existingVideo
    })
  
    const {body} = await context.call<{data:Array<{url:string}>}>("generate-thumbnail",
      {
        url:'https://beta.sree.shop/v1/images/generations',
        method:"POST",
        body:{
          model:"Provider-5/flux-pro",
          prompt,
          n:1,
          size:"1024x1024",
          response_format:"url" 
        }, 
        headers:{
          authorization:`Bearer ddc-beta-lxumivtqmh-IXIaNYVbsOZfzcGI2LZDXSZWXmY8XLNz1bF`
        }
      },
     
    )
    const tempThumbnailUrl = body.data[0].url;
    const mimeType = "image/jpeg"; // MIME type for JPEG image
    const fileName = "image.jpg"; 
    function base64ToFile(base64String:string, mimeType:string, fileName:string) {
      // Remove data URL scheme if present
      const base64Data = base64String.replace(/^data:.+;base64,/, '');
      const byteCharacters = atob(base64Data); // Decode Base64 string
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      return url
  }
    if(!tempThumbnailUrl){
      throw new Error("Bad request")
    }
    await context.run("cleanup-thumbnail",async()=>{
      if(video.thumbnailKey){
        await utapi.deleteFiles(video.thumbnailKey)
        await db
          .update(videos)
          .set({thumbnailKey:null, thumbnailUrl:null})
          .where(and(
            eq(videos.id,videoId),
            eq(videos.userId, userId)
          ))
      }
    })
    const uploadedThumnail = await context.run("upload-thumbnail",async()=>{
      const {data} = await utapi.uploadFilesFromUrl(base64ToFile(tempThumbnailUrl, mimeType, fileName))
      console.log("this is data",data)
      if(!data){
        throw new Error("Bad request")
      }
      return data
    })
   
    await context.run("update-video", async() => {
      await db
        .update(videos)
        .set({
          thumbnailKey:uploadedThumnail.key,
          thumbnailUrl:uploadedThumnail.url
        })
        .where(and(
          eq(videos.id, video.id),
          eq(videos.userId,video.userId)
        ))
    })

    }
  )

