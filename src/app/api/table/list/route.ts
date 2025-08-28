import { NextResponse } from "next/server"
import TableStore from 'tablestore'
import { LoginInfo } from '@/app/api/type'
import Bluebird from 'bluebird'

export async function POST(req: Request) {
  const data = await req.json() as LoginInfo
  const clients = data.instances.reduce((prev, instanceName) => {
    (prev as Record<string, TableStore.Client>)[instanceName] = new TableStore.Client({
      accessKeyId: data.keyId,
      secretAccessKey: data.secret,
      endpoint: `https://${instanceName}.cn-hangzhou.ots.aliyuncs.com`,
      instancename: instanceName,
      httpOptions: {
        timeout: 2000,
        maxSockets: 0,
      },
      maxRetries: 0,
    })
    return prev
  }, {})
  try {
    const res = await Bluebird.props(Object.keys(clients).reduce((prev, instanceName) => {
      prev[instanceName] = (clients as Record<string, TableStore.Client>)[instanceName].listTable({}).then(res => res.tableNames)
      return prev
    }, {} as Record<string, Promise<string[]>>))
    return NextResponse.json(res)
  } catch (err) {
    return NextResponse.json({})
  }
}