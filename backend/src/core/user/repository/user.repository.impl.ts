import { UserRepository, CreateUserDTO } from "./user.repository";
import { UserModel } from "../models/user.model";

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

  async findByUserName(userName: string): Promise<boolean> {
    const user = await UserModel.findOne({ userName });
    return user !== null;
  }

  async findByEmail(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    return user !== null;
  }
}
