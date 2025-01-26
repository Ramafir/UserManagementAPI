import { User } from "@db/entities/User";
import { IUpdateUserDTO } from "@shared/types/DTOs/User";
import { TransactionResult } from "types/TransactionResult";

export interface IUserService {
  updateMany(data: IUpdateUserDTO[]): Promise<TransactionResult<User[]>>;
}
