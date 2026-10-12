import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject, ZodTypeAny } from "zod"

export const validate =
  (schema: { body?: ZodTypeAny; params?: AnyZodObject; query?: AnyZodObject }) =>
  (request: Request, _response: Response, next: NextFunction) => {
    if (schema.body) {
      request.body = schema.body.parse(request.body)
    }

    if (schema.params) {
      request.params = schema.params.parse(request.params)
    }

    if (schema.query) {
      request.query = schema.query.parse(request.query)
    }

    next()
  }
