'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setItemToLocalStorage } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux";
import { instancesSliceActions } from '@/store'
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const areaList = [
  { area: '华东1（杭州）', code: 'cn-hangzhou' },
  { area: '华东2（上海）', code: 'cn-shanghai' },
  { area: '华北1（青岛）', code: 'cn-qingdao' },
  { area: '华北2（北京）', code: 'cn-beijing' },
  { area: '华北3（张家口）', code: 'cn-zhangjiakou' },
  { area: '华北5（呼和浩特）', code: 'cn-huhehaote' },
  { area: '华北6（乌兰察布）', code: 'cn-wulanchabu' },
  { area: '华南1（深圳）', code: 'cn-shenzhen' },
  { area: '华南3（广州）', code: 'cn-guangzhou' },
  { area: '西南1（成都）', code: 'cn-chengdu' },
  { area: '中国香港', code: 'cn-hongkong' },
  { area: '日本（东京）', code: 'ap-northeast-1' },
  { area: '新加坡', code: 'ap-southeast-1' },
  { area: '马来西亚（吉隆坡）', code: 'ap-southeast-3' },
  { area: '印度尼西亚（雅加达）', code: 'ap-southeast-5' },
  { area: '菲律宾（马尼拉）', code: 'ap-southeast-6' },
  { area: '泰国（曼谷）', code: 'ap-southeast-7' },
  { area: '德国（法兰克福）', code: 'eu-central-1' },
  { area: '英国（伦敦）', code: 'eu-west-1' },
  { area: '美国（硅谷）', code: 'us-west-1' },
  { area: '美国（弗吉尼亚）', code: 'us-east-1' },
  { area: '阿联酋（迪拜）', code: 'me-east-1' }
]


type LoginDataType = {
  keyId: string,
  secret: string
  instanceName: string
  area: string
}

export default function Login() {
  const [loginging, setLoginging] = useState(false)
  const dispatch = useDispatch()
  const form = useForm<LoginDataType>({
    defaultValues: {
      keyId: '',
      secret: '',
      instanceName: '',
      area: '',
    }
  })
  const router = useRouter()
  const handleLogin = async (data: LoginDataType) => {
    setLoginging(true)
    const res = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    const status = await res.json()
    if (status.success) {
      setItemToLocalStorage('data', {
        ...data,
        instances: [
          data.instanceName,
        ]
      })
      dispatch(instancesSliceActions.addInstance(data.instanceName))
      router.push('/')
      router.refresh()
    } else {
      toast.error('验证失败', {
        position: 'top-center'
      })
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Table Store</CardTitle>
          <CardDescription>
            Login OTS
          </CardDescription>
        </CardHeader>
        <Form {...form} >
          <CardContent>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Access Key ID</Label>
                  <FormField name="keyId" control={form.control} render={({ field }) => (
                    <Input {...field} id="keyId" required />
                  )} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secret">Access Key Secret</Label>
                  <FormField name="secret" control={form.control} render={({ field }) => (
                    <Input {...field} id="secret" type="password" required />
                  )} />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="secret">Instance Name</Label>
                    <FormField name="instanceName" control={form.control} render={({ field }) => (
                      <Input {...field} id="instanceName" required placeholder="实例名称" />
                    )} />
                  </div>
                  <div className="grid gap-2 col-start-4 col-span-2">
                    <Label htmlFor="area">Area</Label>
                    <FormField name="area" control={form.control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择地区" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>地域</SelectLabel>
                            {
                              areaList.map(item => (
                                <SelectItem key={item.code} value={item.code}>{item.area}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loginging}>
                {
                  loginging ? <LoaderCircle className="animate-spin" /> : <p>Login</p>
                }
              </Button>
            </form>
          </CardContent>
        </Form>
      </Card>
    </div>
  )
}

