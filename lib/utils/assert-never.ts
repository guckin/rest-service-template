export function assertNever(val: never): never {
    throw `Unexpected value ${val}`;
}
