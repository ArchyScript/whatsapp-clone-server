import { createHandler } from "graphql-http/lib/use/express"
import type { Request } from "express"
import { graphqlSchema } from "./schema.js"
import { graphqlRoot } from "./root.js"
import { verifyAccessToken } from "../../utils/jwt.js"

const extractAuth = (request: Request) => {
  const header = request.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return null
  }

  try {
    return verifyAccessToken(header.replace("Bearer ", ""))
  } catch {
    return null
  }
}

export const graphqlHandler = createHandler({
  schema: graphqlSchema,
  rootValue: graphqlRoot,
  context: (request, _params) => {
    const raw = request.raw as Request
    return {
      auth: extractAuth(raw),
      ipAddress: raw.ip,
      userAgent: raw.headers["user-agent"]
    }
  }
})
