export enum Action {
    Request,
    Response,
}

export interface Options {
    resource: string;
    operands?: string[];
}
