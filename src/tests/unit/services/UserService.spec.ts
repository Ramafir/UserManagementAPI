import { In } from "typeorm";
import { assert } from "chai";
import { User } from "@db/entities/User";
import { Role } from "@db/entities/Role";
import { mockRepository } from "../mockRepository";
import { SinonFakeTimers, SinonSandbox, createSandbox } from "sinon";

import { Warden } from "@utils/Warden";
import { UserService } from "@services/UserService";
import { UserRepository } from "@repositories/UserRepository";

const roleId = 2;

describe("UserService", () => {
  let sandbox: SinonSandbox;
  let clock: SinonFakeTimers;
  const fakeDate = new Date(2019, 1, 1, 0, 0);

  describe("updateMany tests", () => {
    beforeEach(() => {
      sandbox = createSandbox();

      clock = sandbox.useFakeTimers({
        now: fakeDate,
      });

      global.log = sandbox.createStubInstance(Warden);
    });

    afterEach(() => {
      clock.restore();

      sandbox.restore();
    });

    it("should throw error that not all roles are available", async () => {
      // Arrange
      const { repository: userRepository, manager } = mockRepository(
        UserRepository,
        sandbox,
        {
          fakeManager: {
            find: sandbox.stub().callsFake(() => []),
          },
        }
      );

      const userService = new UserService(userRepository);

      // Act
      const result = await userService.updateMany([
        {
          id: 1,
          data: { roleId },
        },
      ]);

      // Assert
      assert.equal(
        manager.find.calledOnceWith(Role, {
          where: {
            id: In([roleId]),
          },
        }),
        true
      );

      assert.equal(result.isSuccess, false);
      assert.equal(
        result.error,
        "Not all roles are available to perform operation."
      );
    });

    it("should restore users (isActive=true)", async () => {
      // Arrange
      const { repository: userRepository, manager } = mockRepository(
        UserRepository,
        sandbox,
        {
          fakeManager: {
            find: sandbox.stub().callsFake(() => []),
          },
        }
      );

      const userService = new UserService(userRepository);

      // Act
      const result = await userService.updateMany([
        {
          id: 1,
          data: { isActive: true },
        },
        {
          id: 2,
          data: { isActive: true },
        },
      ]);

      // Assert
      assert.equal(manager.find.notCalled, true);

      assert.equal(manager.create.calledTwice, true);

      assert.equal(
        manager.save.calledOnceWith(User, [
          {
            id: 1,
            deletedAt: null,
          },
          {
            id: 2,
            deletedAt: null,
          },
        ]),
        true
      );

      assert.equal(result.isSuccess, true);
      assert.equal(result.error, undefined);
    });

    it("should deactivate users (isActive=false)", async () => {
      // Arrange
      const { repository: userRepository, manager } = mockRepository(
        UserRepository,
        sandbox,
        {
          fakeManager: {
            find: sandbox.stub().callsFake(() => []),
          },
        }
      );

      const userService = new UserService(userRepository);

      // Act
      const result = await userService.updateMany([
        {
          id: 1,
          data: { isActive: false },
        },
        {
          id: 2,
          data: { isActive: false },
        },
      ]);

      // Assert
      assert.equal(manager.find.notCalled, true);

      assert.equal(manager.create.calledTwice, true);

      assert.equal(
        manager.save.calledOnceWith(User, [
          {
            id: 1,
            deletedAt: fakeDate,
          },
          {
            id: 2,
            deletedAt: fakeDate,
          },
        ]),
        true
      );

      assert.equal(result.isSuccess, true);
      assert.equal(result.error, undefined);
    });

    it("should save users with new role", async () => {
      // Arrange
      const { repository: userRepository, manager } = mockRepository(
        UserRepository,
        sandbox,
        {
          fakeManager: {
            find: sandbox.stub().callsFake(() => [{ id: roleId }]),
          },
        }
      );

      const userService = new UserService(userRepository);

      // Act
      const result = await userService.updateMany([
        {
          id: 1,
          data: { roleId },
        },
        {
          id: 2,
          data: { roleId },
        },
      ]);

      // Assert
      assert.equal(
        manager.find.calledOnceWith(Role, {
          where: {
            id: In([roleId]),
          },
        }),
        true
      );

      assert.equal(manager.create.calledTwice, true);

      assert.equal(
        manager.save.calledOnceWith(User, [
          {
            id: 1,
            role: { id: roleId },
          },
          {
            id: 2,
            role: { id: roleId },
          },
        ]),
        true
      );

      assert.equal(result.isSuccess, true);
      assert.equal(result.error, undefined);
    });
  });
});
