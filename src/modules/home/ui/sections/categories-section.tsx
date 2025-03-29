"use client"
import { Suspense } from "react";
import {ErrorBoundary} from "react-error-boundary"

import { trpc } from "@/trpc/client";
import { FilterCarousal } from "@/components/filter-carousal";
import { useRouter } from "next/navigation";

interface CategoriesSectionProps{
    categoryId?:string;
}

export const CategoriesSection = ({categoryId}:CategoriesSectionProps)=>{
  return (
    <Suspense fallback={<CategoriesSkeleton/>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId}/>
      </ErrorBoundary>
    </Suspense>
  )
}

const CategoriesSkeleton = ()=>{
  return <FilterCarousal isLoading data={[]} onSelect={()=>{}}/>
}
const CategoriesSectionSuspense = ({categoryId}:CategoriesSectionProps) => {
  const router = useRouter()
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map(({name,id})=>({
    value:id,
    label:name
  }))

  const onSelect = (value:string | null)=>{
    const url = new URL(window.location.href)
    if(value){
      url.searchParams.set("categoryId",value)
    }
    else{
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString())
  }
  return (
    <FilterCarousal onSelect={onSelect} value={categoryId} data={data}/>
  )
}


