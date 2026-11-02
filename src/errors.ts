export class NotFoundError extends Error {
    constructor(entity : string, id? : number) {
        super(id === undefined ? `${entity} not found` : `${entity} with id ${id} not found`);
        this.name = 'NotFoundError';
    }
}