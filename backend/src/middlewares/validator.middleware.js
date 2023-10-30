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
 * @param validator {ObjectSchema}
 * @param property {'body'|'params'|'query'}
 * @returns {(function(Request, Response, NextFunction): void)|*}
 */
const validate = (validator, property) => {
    return (req, res, next) => {
        const data = property === 'body' ? req.body : property === 'params' ? req.params : req.query;
        validator.validateAsync(data, { errors: { wrap: { label: '\'' } } }).then((validatedData) => {
            req[property] = validatedData;
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
