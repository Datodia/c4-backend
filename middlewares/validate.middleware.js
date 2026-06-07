const { z } = require("zod")

module.exports = (schema) => {
  return (req, res, next) => {
    const body = req.body ?? {}

    const resp = schema.safeParse(body)

    if (!resp.success) {
      return res.status(400).json({
        errors: resp.error.issues.map((e) => ({
          message: e.message,
          path: e.path.length ? e.path.join(".") : "root",
        })),
      })
    }

    req.body = resp.data
    next()
  }
}