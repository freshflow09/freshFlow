import { UserRepository, CreateUserDTO } from "./user.repository";
import { UserModel } from "../models/user.model";
import { User } from "../types/type";

export class MongoUserRepository implements UserRepository {
  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const user = new UserModel(dto);
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async getUser(id: string): Promise<any> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  async findByUserName(userName: string): Promise<User | null> {
    return await UserModel.findOne({ userName });
  }
}
