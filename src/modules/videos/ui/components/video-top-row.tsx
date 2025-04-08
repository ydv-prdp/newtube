import { useMemo } from "react";
import { VideoGetOneOutput } from "../../types"
import {format, formatDistanceToNow} from "date-fns"
import { VideoDescription } from "./video-description";
import { VideoMenu } from "./video-menu";
import { VideoOwner } from "./video-owner";
import { VideoReactions } from "./video-reactions";
interface VideoTopRowProps{
    video:VideoGetOneOutput;
}
const VideoTopRow = ({video}:VideoTopRowProps) => {
    const compactViews = useMemo(()=>{
        return Intl.NumberFormat("en",{
            notation:"compact"
        }).format(video.viewCount)
    },[video.viewCount])
    const expandedViews = useMemo(()=>{
        return Intl.NumberFormat("en",{
            notation:"standard"
        }).format(video.viewCount)
    },[video.viewCount])
    const compactDate = useMemo(()=>{
        return formatDistanceToNow(video.createdAt,{
            addSuffix:true
        })
    },[video.createdAt])
    const expandedDate = useMemo(()=>{
        return format(video.createdAt,"d MMM yyyy")
    },[video.createdAt])
  return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="font-semibold text-xl">
                {video.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} videoId={video.id}/>
                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
                    <VideoReactions
                        videoId={video.id}
                        likes={video.likeCount}
                        dislikes={video.dislikeCount}
                        viewerReaction={video.viewerReaction}
                    />
                    <VideoMenu videoId={video.id} variant="secondary"/>
                </div>
            </div>
            <VideoDescription
                description={video.description}
                compactViews={compactViews}
                expandedViews={expandedViews}
                compactDate={compactDate}
                expandedDate={expandedDate} 
            />
        </div>
    )
}

export default VideoTopRow