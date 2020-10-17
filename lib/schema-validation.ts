import * as joi from 'joi';
import {Schema as JoiSchema} from 'joi';
import {assertNever} from "./utils/assert-never";

export type Schema<T> =
    | NumberSchema
    | StringSchema
    | ObjectSchema<T>
    | ArraySchema<T>;

export enum ValidationType {
    Number,
    String,
    Object,
    Array
}

export interface ObjectSchema<T> {
    readonly type: ValidationType.Object;
    readonly schema: {
        readonly [P in keyof T]: Schema<T[P]>;
    };
    readonly error: string;
}

export interface NumberSchema {
    readonly type: ValidationType.Number;
    readonly error: string;
}

export interface StringSchema {
    readonly type: ValidationType.String;
    readonly error: string;
}

export interface ArraySchema<T> {
    readonly type: ValidationType.Array
    readonly arrayType: Schema<T>;
    readonly error: string;
}

export interface Valid<T> {
    type: 'valid';
    value: T;
}

export function Valid<T>(value: T): Valid<T> {
    return {
        type: 'valid',
        value
    };
}

export interface Invalid {
    type: 'invalid';
    value: unknown;
    error: string;
}

export function Invalid({value, error}: Omit<Invalid, 'type'>): Invalid {
    return {
        type: 'invalid',
        value,
        error
    };
}

export function validate<T>(data: unknown, schema: Schema<T>): Invalid | Valid<T> {
    const {error, value} = createValidator(schema).validate(data);
    return error ? Invalid({value, error: <any>error}) : Valid(<T>value);
}

function createValidator<T>(schema: Schema<T>): JoiSchema {
    switch (schema.type) {
        case ValidationType.Array:
            return joi.array()
                .items(createValidator(schema.arrayType))
                .error(() => schema.error)
                .required();
        case ValidationType.Number:
            return joi.number()
                .error(() => schema.error)
                .required();
        case ValidationType.Object:
            return joi.object(
                Object.fromEntries(
                    Object.entries(schema.schema)
                        .map(([property, value]) => [property, createValidator(<Schema<unknown>>value)])
                )
            ).error(() => schema.error).required();
        case ValidationType.String:
            return joi.string()
                .error(() => schema.error)
                .required();
        default:
            return assertNever(schema);
        }
}
