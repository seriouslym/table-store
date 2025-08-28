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
import { Loader2 } from "lucide-react";

type LoginDataType = {
  keyId: string,
  secret: string
  instanceName: string
}

export default function Login() {
  const [loginging, setLoginging] = useState(false)
  const dispatch = useDispatch()
  const form = useForm<LoginDataType>({
    defaultValues: {
      keyId: '',
      secret: '',
      instanceName: ''
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
                <div className="grid gap-2">
                  <Label htmlFor="secret">Instance Name</Label>
                  <FormField name="instanceName" control={form.control} render={({ field }) => (
                    <Input {...field} id="instanceName" required />
                  )} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loginging}>
                {
                  loginging ? <Loader2 className="animate-spin" /> : <p>Login</p>
                }
              </Button>
            </form>
          </CardContent>
        </Form>
      </Card>
    </div>
  )
}

