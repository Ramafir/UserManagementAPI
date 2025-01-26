import * as typeorm from "typeorm";
import { SinonSandbox, SinonStubbedInstance, SinonStub } from "sinon";

export const mockRepository = <T>(
  Class: { new (): T },
  sandbox: SinonSandbox,
  overrides: {
    fakeManager?: Partial<
      Record<keyof typeorm.EntityManager, SinonStub<unknown[], unknown>>
    >;
    fakeQueryRunner?: Partial<
      Record<keyof typeorm.QueryRunner, SinonStub<unknown[], unknown>>
    >;
  } = {}
): {
  repository: SinonStubbedInstance<T>;
  manager: Record<string, SinonStub<unknown[], unknown>>;
} => {
  const {
    fakeManager: fakeManagerOverrides,
    fakeQueryRunner: fakeQueryRunnerOverrides,
  } = overrides;

  const fakeManager = {
    getRepository: sandbox.stub().returnsThis(),
    createQueryBuilder: sandbox.stub().returnsThis(),
    useTransaction: sandbox.stub().returnsThis(),
    where: sandbox.stub().returnsThis(),
    find: sandbox.stub().returnsThis(),
    create: sandbox.stub().callsFake((Entity, data) => ({ ...data })),
    save: sandbox.stub().callsFake(() => <T>[]),
    ...fakeManagerOverrides,
  };

  const fakeQueryRunner = {
    manager: fakeManager,
    release: sandbox.stub().returnsThis(),
    commitTransaction: sandbox.stub().returnsThis(),
    rollbackTransaction: sandbox.stub().returnsThis(),
    ...fakeQueryRunnerOverrides,
  };

  const repository = sandbox.createStubInstance(Class);

  (repository as any).useTransaction = () => fakeQueryRunner;

  return { repository, manager: fakeManager };
};
