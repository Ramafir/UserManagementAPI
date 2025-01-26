export class CORSError extends Error {
    constructor(message = 'Not allowed by CORS') {
        super(message);
    }
}
