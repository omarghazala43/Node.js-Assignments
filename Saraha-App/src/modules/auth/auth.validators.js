import joi from "joi";
import { Role } from "../../common/enums/role.js";
import { Gender } from "../../common/enums/gender.js";

export const signUpSchema = {
  body: joi.object({
    email: joi
      .string()
      .email({
        minDomainSegments: 1,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "eg"] },
      })
      .lowercase()
      .min(5)
      .max(100)
      .trim()
      .messages({
        "string.email": "Invalid email",
        "any.required": "Email is required",
      })
      .required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    age: joi.number().min(10).max(60).positive().integer().required(),
    role: joi.string().valid(...Object.values(Role)),
    gender: joi.string().valid(...Object.values(Gender)),
  }),
};

export const loginSchema = {
  body: joi.object({
    email: joi
      .string()
      .email({
        minDomainSegments: 1,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "eg"] },
      })
      .lowercase()
      .trim()
      .messages({
        "string.email": "Invalid email",
        "any.required": "Email is required",
      })
      .required(),
    password: joi.string().required(),
  }),
};
