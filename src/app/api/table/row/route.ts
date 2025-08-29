import { NextResponse } from "next/server"
import TableStore from 'tablestore'
import { LoginInfo } from "../../../type"
import _ from 'lodash'

export async function POST(req: Request) {
  const data = await req.json() as LoginInfo & {
    tableName: string,
    primaryKeys: Record<string, string>
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
  const primaryKey = _.chain(data.primaryKeys).keys().map(key => ({ [key]: data.primaryKeys[key] })).value()
  try {
    const res = await client.getRow({
      tableName: data.tableName,
      primaryKey,
      maxVersions: 1
    })
    return NextResponse.json(res.row)
  } catch (err) {
    return NextResponse.json({})
  }
}