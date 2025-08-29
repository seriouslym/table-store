import { NextResponse } from "next/server"
import TableStore from 'tablestore'
import { LoginInfo } from "../../../type"


export async function POST(req: Request) {
  const data = await req.json() as LoginInfo & {
    tableName: string
  }
  const client = new TableStore.Client({
    accessKeyId: data.keyId,
    secretAccessKey: data.secret,
    endpoint: `https://${data.instanceName}.${data.area}.ots.aliyuncs.com`,
    instancename: data.instanceName,
    httpOptions: {
      timeout: 2000,
      maxSockets: 0,
    },
    maxRetries: 0,
  })
  try {
    const res = await client.describeTable({
      tableName: data.tableName
    })
    return NextResponse.json(res)
  } catch (err) {
    return NextResponse.json({})
  }
}