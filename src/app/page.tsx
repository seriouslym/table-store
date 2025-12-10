'use client'
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import Empty from "@/components/empty"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Rows2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { toast } from 'sonner'
import { useForm } from "react-hook-form"
import { debounce, getItemFromLocalStorage } from "@/lib/utils"
import { useCallback } from 'react'
import { LoginInfo, PrimaryKey } from "./type"
import _ from "lodash"
import { useDispatch } from "react-redux"
import { tableDescSliceActions } from "@/store"
import { resolve } from "path"
import Loading from "@/components/loading"
export default function Home() {
  const dispatch = useDispatch()
  const [dataCopy, setDataCopy] = useState<{ key: string, value: string, type: string }[]>([])
  const tableDesc = useSelector((state: RootState) => state.tableDescState)
  const tableName = useSelector((state: RootState) => state.tableNameState)
  const instanceName = useSelector((state: RootState) => state.instanceNameState)
  const [basicInfo, setBasicInfo] = useState([] as PrimaryKey[])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [data, setData] = useState([] as { key: string, value: string, type: string }[])
  const [descLoading, setDescLoading] = useState(false)
  const [rowLoading, setRowLoading] = useState(false)
  const form = useForm()
  const loginInfo = getItemFromLocalStorage('data') as LoginInfo
  const handleFormSubmit = async (data: any) => {
    setRowLoading(true)
    const result = await fetch("/api/table/row", {
      method: 'POST',
      body: JSON.stringify({
        ...loginInfo,
        instanceName,
        tableName,
        primaryKeys: data
      })
    }).catch(err => {
      toast.error("读取失败", {
        position: 'top-center'
      })
    })
    let row = await result?.json()
    if (!_.isEmpty(row)) {
      toast.success("读取成功", {
        position: 'top-center'
      })
      const attributes = (row?.attributes || []).map((each: { columnName: string; columnValue: string }) => ({ key: each.columnName, value: each.columnValue, type: typeof each.columnValue }))
      setDataCopy(attributes)
      setData(attributes)
    } else {
      toast.error("读取所在行不存在", {
        position: 'top-center'
      })
    }
    setIsDialogOpen(!isDialogOpen)
    setRowLoading(false)
  }
  const handleOpenDialog = () => {
    if (!tableName) {
      toast.error("请先选择表", {
        position: 'top-center'
      })
      return
    }
    setIsDialogOpen(!isDialogOpen)
  }
  const filterAttribute = useCallback(
    debounce((e: any) => {
      const filter = e.target.value
      if (filter) {
        setData(dataCopy.filter(each => each.key.startsWith(filter)))
      } else {
        setData(dataCopy)
      }
    }, 500),
    [dataCopy]
  )
  useEffect(() => {
    if (tableName && instanceName) {
      const key = `${instanceName}-${tableName}`
      if (tableDesc[key]) {
        setBasicInfo(tableDesc[key])
        setDescLoading(false)
        return
      }
      setDescLoading(true)
      fetch("/api/table/desc", {
        method: "post",
        body: JSON.stringify({
          ...loginInfo,
          instanceName,
          tableName
        })
      }).then(async res => {
        const data = await res.json()
        const primaryKey = data?.tableMeta?.primaryKey as PrimaryKey[]
        setBasicInfo(primaryKey ?? [])
        const defaultValues: Record<string, string> = {}
        primaryKey.forEach(field => {
          defaultValues[field.name] = '';
        });
        dispatch(tableDescSliceActions.setTableDesc({ tableName: `${instanceName}-${tableName}`, tableDescs: primaryKey }))
        setDescLoading(false)
        form.reset(defaultValues);
      })
    }
  }, [tableName, instanceName])
  return (
    <>
      <div className="flex flex-1 flex-col p-4 pt-0 pb-8 mx-4">
        <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="">
            <div className="flex justify-start gap-4 m-4 items-center ">
              <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
                <DialogTrigger asChild>
                  <Button variant='outline' className="w-[96px]">
                    <Rows2 />
                    <Label>单行读</Label>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>主键信息</DialogTitle>
                  </DialogHeader>
                  {
                    descLoading ? <div className="flex justify-center">
                      <Loading />
                    </div> :
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                          <Table className="overflow-hidden" >
                            <TableHeader>
                              <TableRow>
                                <TableHead>名称</TableHead>
                                <TableHead>类型</TableHead>
                                <TableHead>键值</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-hidden">
                              {
                                basicInfo.map(each => {
                                  return <TableRow key={each.name}>
                                    <TableCell>{each.name}</TableCell>
                                    <TableCell>{each.type}</TableCell>
                                    <TableCell>
                                      <FormItem>
                                        <FormField control={form.control} name={each.name} render={({ field }) => (
                                          <FormControl>
                                            <Input className="w-3/4" {...field} />
                                          </FormControl>
                                        )} />
                                      </FormItem>
                                    </TableCell>
                                  </TableRow>
                                })
                              }
                            </TableBody>

                          </Table>
                          <div className="flex justify-center items-center gap-4 mt-4">
                            <Button type="submit">
                              {rowLoading ? <Loading /> : '确定'}
                            </Button>
                            <Button variant='outline' type="button" onClick={handleOpenDialog}>取消</Button>
                          </div>
                        </form>
                      </Form>
                  }
                </DialogContent>
              </Dialog>
              {/* <Button variant='outline' className="w-[96px]">
                <Rows3/>
                <Label>批量读</Label>
              </Button> */}
              <Input placeholder="过滤属性" className="w-[200px]" onChange={filterAttribute} />
            </div>
          </div>
          <Separator />
          {
            data.length ? <div className="h-[700px] overflow-hidden">
              <TableData data={data} />
            </div> : <Empty className="h-[calc(95%-36px)]" />
          }
        </div>
      </div>
    </>
  )
}



const TableData = ({ data }: { data: { key: string, value: string, type: string }[] }) => {
  // 确保值总是字符串类型
  const formatValue = (value: string | null | boolean) => {
    return '' + value;
  };

  // 复制功能
  const copyToClipboard = (text: string) => {
    toast.success("复制成功", {
      position: 'top-center'
    })
    navigator.clipboard.writeText(text).catch(err => {
      console.error('复制失败:', err);
    });
  };

  return <>
    <div className="relative h-full">
      <div className="overflow-hidden h-full">
        <div className="overflow-y-auto h-full ml-4">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[50px]">属性名</TableHead>
                <TableHead className="w-[500px]">属性值</TableHead>
                <TableHead className="w-[150px]">类型</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {data.map(each => {
                const formattedValue = formatValue(each.value);
                return <TableRow key={each.key} className="group relative">
                  <TableCell>{each.key}</TableCell>
                  <TableCell>
                    <div
                      className="w-full break-words break-all whitespace-normal"
                    >
                      {formattedValue}
                      <Button
                        onClick={() => { copyToClipboard(formattedValue) }}
                        className="h-[30px] absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="复制"
                        variant='outline'
                      >
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">复制</Label>
                        </div>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{each.type}</TableCell>
                </TableRow>
              })
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </>
}



