import { formatDuration } from "@/lib/utils";
import Image from "next/image"
import { THUMBNAIL_FALLBACK } from "../../constants";

interface VideoThumbnailProps{
  title:string;
  imageUrl?:string | null;
  previewUrl?:string | null;
  duration:number;
}

export const VideoThumbnail = ({imageUrl,previewUrl,title,duration}:VideoThumbnailProps) => {
  return (
    <div className="relative group">
        <div className="relative w-full overflow-hidden rounded-xl aspect-video">
            <Image
                src={imageUrl || THUMBNAIL_FALLBACK}
                alt="Placeholder"
                fill
                className="h-full w-full object-cover group-hover:opacity-0"
            />
             <Image
                unoptimized={!!previewUrl}
                src={previewUrl || THUMBNAIL_FALLBACK}
                alt="Placeholder"
                fill
                className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
            />
        </div>
        <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          {formatDuration(duration)}
        </div>
    </div>
  )
}
