export const validate = (schema) => {
  return (req, res, next) => {
    const error = [];
    for (const key of Object.keys(schema)) {
      const result = schema[key].validate(req[key], { abortEarly: false });

      if (result.error) {
        const errors = result.error.details.map((e) => {
          return { message: e.message, path: e.path };
        });
        error.push({ field: key, errors });
      }
    }
    if (error.length) {
      return res.status(400).json({ message: "validation error", errors :error});
    }

    next();
  };
};
