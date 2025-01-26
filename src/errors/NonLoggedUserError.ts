export class NonLoggedUserError extends Error {
    constructor(message = 'This action requires logged user in request but there is no logged user.') {
        super(message);
    }
}
