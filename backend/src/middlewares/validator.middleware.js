/**
 * @openapi
 * components:
 *   responses:
 *     errorValidate:
 *       description: Unprocessable Entity
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

import { HttpException } from '../exceptions/HttpException.js';

/**
 * @param validator {{joiSchema: ObjectSchema, location: 'body'|'params'|'query'}}
 * @returns {(function(Request, Response, NextFunction): void)|*}
 */
const validate = (validator) => {
    return (req, res, next) => {
        const data = validator.location === 'body' ? req.body : validator.location === 'params' ? req.params : req.query;
        validator.joiSchema.validateAsync(data, { errors: { wrap: { label: '\'' } } }).then((validatedData) => {
            req[validator.location] = validatedData;
            next();
        }).catch(error => {
            next(error.isJoi
                ? new HttpException(422, error.message, error.message)
                : error instanceof Error
                    ? new HttpException(500, error.message, error.message)
                    : new HttpException(500, 'Something went wrong', 'Something went wrong'));
        });
    };
};

export default validate;
