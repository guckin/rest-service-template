import {Schema, validate, ValidationType} from "./schema-validation";

interface Foo {
    foo: string,
    baz: number,
    qux: {
        quxx: number
    }
}

const schema: Schema<Foo> = {
    type: ValidationType.Object,
    schema: {
        foo: {
            type: ValidationType.String,
            error: 'Invalid Type - foo'
        },
        baz: {
            type: ValidationType.Number,
            error: 'Invalid Type - baz'
        },
        qux: {
            type: ValidationType.Object,
            schema: {
                quxx: {
                    type: ValidationType.Number,
                    error: 'Invalid Type - quxx'
                }
            },
            error: 'Invalid Type - qux'
        }
    },
    error: 'Invalid Body'
};

const value = {
    foo: 'string',
    baz: 1,
    qux: {
        quxx: 'string'
    }
};

const validation = validate<Foo>(value, schema);
