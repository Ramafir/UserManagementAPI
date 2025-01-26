export class NonSequelizeInstanceError extends Error {
    constructor(message = 'This action requires sequelize instance in request but there is no instance.') {
        super(message);
    }
}
