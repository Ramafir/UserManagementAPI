export enum processType {
    Api = 'API',
    Queues = 'QUEUES',
    Scheduler = 'SCHEDULER',
    Tests = 'TESTS'
}

export const ALL_PROCESS_TYPES = Object.values(processType);
