'use client'
import {
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useDispatch, useSelector } from 'react-redux'
import { instancesSliceActions, RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
export function AppContent({ children }: { children: React.ReactNode }) {
  const tableName = useSelector((state: RootState) => state.tableNameState)
  const instanceName = useSelector((state: RootState) => state.instanceNameState)
  const router = useRouter()
  const dispatch = useDispatch()
  const logout = () => {
    localStorage.removeItem("data")
    dispatch(instancesSliceActions.setInstances([]))
    router.push('/')
    router.refresh()
  }
  return <>
    <SidebarInset>
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>{instanceName}</BreadcrumbLink>
              </BreadcrumbItem>
              {
                tableName !== "" && <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{tableName}</BreadcrumbPage>
                  </BreadcrumbItem></>
              }
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button variant='outline' className="mr-8" onClick={logout}>退出</Button>
      </header>
      {children}
    </SidebarInset>
  </>
}

