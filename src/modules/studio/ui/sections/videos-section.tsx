"use client"

import { InfiniteScroll } from "@/components/infinite-scroll"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_LIMIT } from "@/constants"
import { snakeCaseToTitle } from "@/lib/utils"
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail"
import { trpc } from "@/trpc/client"
import { format } from "date-fns"
import { Globe2Icon, LockIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


export const VideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideosSectionSkeleton = () => {
    return (
        <>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton
                                            className="h-20 w-36"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-4 w-[100px]"/>
                                            <Skeleton className="h-3 w-[150px]"/>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-16"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-24"/>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-12 ml-auto"/>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-12 ml-auto"/>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-12 ml-auto"/>
                                </TableCell> 
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    )
    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) => page.items).map((video) => (
                            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                <TableRow className="cursor-pointer">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail
                                                    imageUrl={video.thumbnailUrl}
                                                    previewUrl={video.previewUrl}
                                                    title={video.title}
                                                    duration={video.duration || 0}
                                                />
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="text-sm line-clamp-1">
                                                    {video.title}
                                                </span>
                                                <span className="text-sm text-muted-foreground line-clamp-1">
                                                    {video.description || "no description"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {video.visibility === "private" ? (
                                                <LockIcon className="size-4 mr-2" />
                                            ) : (
                                                <Globe2Icon className="size-4 mr-2" />
                                            )}
                                            {snakeCaseToTitle(video.visibility)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {snakeCaseToTitle(video.muxStatus || "error")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="truncate text-sm">
                                        {format(new Date(video.createdAt), "d MMM yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        Views
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        Comments
                                    </TableCell>
                                    <TableCell className="text-right text-sm pr-6">
                                        Likes
                                    </TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}