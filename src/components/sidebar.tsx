'use client'
import { Home, ChevronRight, PackagePlus, Braces, FileText, Database, Library, Book } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { tableNameSliceActions, instanceNameSliceActions, instancesSliceActions } from "@/store"
import { useSelector } from 'react-redux'
import { RootState } from "@/store"

import { getItemFromLocalStorage, setItemToLocalStorage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const iconList = [
  Home,
  Braces,
  FileText,
  Database,
  Library,
  Book
]


export function AppSidebar() {
  const dispatch = useDispatch()
  const tableName = useSelector((state: RootState) => state.tableNameState)
  const sideBarInstances = useSelector((state: RootState) => state.instancesState)
  const [instancesInfo, setInstancesInfo] = useState({} as Record<string, string[]>)
  console.log('instancesInfo', instancesInfo)
  const [collapsedStates, setCollapsedStates] = useState([] as boolean[])
  const toggleCollapse = (idx: number) => {
    setCollapsedStates(prev => {
      const newStates = [...prev]
      newStates[idx] = !newStates[idx]
      return newStates
    })
  }
  const loginInfo = getItemFromLocalStorage('data')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleFormSubmit = async (values: any) => {
    if (values.instanceName in instancesInfo) {
      toast.error('实例已存在', {
        position: 'top-center'
      })
      return
    }
    const res = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({
        ...loginInfo,
        instanceName: values.instanceName,
      })
    })
    const data = await res.json()
    if (data.success) {
      dispatch(instancesSliceActions.addInstance(values.instanceName))
      toast.success('添加成功', {
        position: 'top-center'
      })
      setIsDialogOpen(false)
      const originData = getItemFromLocalStorage('data')
      setItemToLocalStorage('data', {
        ...originData,
        instances: [...originData.instances, values.instanceName]
      })
      return
    }
    toast.error('实例不存在', {
      position: 'top-center'
    })
  }
  useEffect(() => {
    const fetchData = async () => {
      return await fetch('/api/table/list', {
        method: 'POST',
        body: JSON.stringify({
          ...loginInfo,
          instances: sideBarInstances
        })
      })
    }
    fetchData().then(async res => {
      const data = await res.json()
      setInstancesInfo(data)
    })
  }, [sideBarInstances])
  const newInstanceForm = useForm<{ instanceName: string }>({
    defaultValues: {
      instanceName: ''
    }
  })
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <div className="flex justify-between">
              <SidebarGroupLabel>Table Instances</SidebarGroupLabel>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <PackagePlus />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>New Instance</p>
                  </TooltipContent>
                </Tooltip>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增实例</DialogTitle>
                  </DialogHeader>
                  <Form {...newInstanceForm}>
                    <form onSubmit={newInstanceForm.handleSubmit(handleFormSubmit)}>
                      <div className="space-y-8">
                        <div className="flex items-center justify-center space-x-8">
                          <Label htmlFor="instanceName" className="">实例名称</Label>
                          <FormField
                            control={newInstanceForm.control}
                            name="instanceName"
                            render={({ field }) => (
                              <Input className="w-[200px]" {...field} />
                            )}
                          >
                          </FormField>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <Button type="submit">确定</Button>
                          <Button variant='outline'>取消</Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {
                  Object.entries(instancesInfo).map(([instance, tables], index) => {
                    const Icon = iconList[index % iconList.length]
                    return (
                      <Collapsible key={instance} onOpenChange={() => toggleCollapse(index)} className="group/collapsible" open={collapsedStates[index]}>
                        <SidebarMenuItem key={instance} >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="relative">
                              <Icon />
                              <span>{instance}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {
                                tables.map(table => {
                                  return <SidebarMenuButton key={table}
                                    isActive={tableName === table}
                                    onClick={() => {
                                      dispatch(tableNameSliceActions.changeTableName(table))
                                      dispatch(instanceNameSliceActions.changeInstanceName(instance))
                                    }}>
                                    <span className="">{table}</span>
                                  </SidebarMenuButton>
                                })
                              }
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  })
                }
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

