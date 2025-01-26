import { User } from "@db/entities/User";
import { BaseMapper } from "./BaseMapper";

export class UserMapper extends BaseMapper<User> {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;

  constructor(data: User) {
    super(data, ["id", "email", "role"]);
    
    this.assignInitialKeys();

    this.fullName = [data.firstName, data.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    this.isActive = data.deletedAt === null;

    this.role = data.role;
  }
}
