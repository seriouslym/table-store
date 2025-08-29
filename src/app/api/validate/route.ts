import { NextResponse } from 'next/server'
import TableStore from 'tablestore'

export async function POST(req: Request) {
  const data = await req.json()
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
    await client.listTable({})
  } catch (err) {
    return NextResponse.json({ success: false })
  }
  return NextResponse.json({ success: true })
}
