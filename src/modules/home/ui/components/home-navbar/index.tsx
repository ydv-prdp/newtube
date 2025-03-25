import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { SearchInput } from "./search-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"

export const HomeNavbar = ()=>{
    return(
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 z-50">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger/>
                    <Link href={"/"}>
                        <div className="p-4 flex items-center gap-1">
                            <Image src={"/logo.svg"} alt="logo" width={32} height={32}/>
                            <p className="text-xl font-semibold tracking-tighter">NewTube</p>
                        </div>
                    </Link>
                </div>

                {/*Search Bar */}
                <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                    <SearchInput/>
                </div>

                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton/>
                </div>
            </div>
        </nav>
    )
}