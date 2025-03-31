import { db } from "@/db";
import { videos } from "@/db/schema";
import {z} from "zod"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";

export const videosRouter = createTRPCRouter({
    create:protectedProcedure.mutation(async ({ctx})=>{
        const {id:userId} = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings:{
                passthrough:userId,
                playback_policy:["public"],
            },
            cors_origin:"*"
        })
        const [video] = await db.insert(videos).values(
            {
                userId,
                title:"Untitled",
                muxStatus:"waiting",
                muxUploadId:upload.id
            })
            .returning();
            return {
                video:video,
                url:upload.url
            }
    })
})