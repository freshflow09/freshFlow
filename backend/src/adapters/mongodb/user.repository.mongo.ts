import { UserRepository, CreateUserDTO } from "../../core/user/repository/user.repository"
import { User } from "../../core/user/types/type"
import { UserModel } from "./user.schema"

export class MongoUserRepository implements UserRepository {

  async findByUserName(userName: string);

  async createUser(data: CreateUserDTO):User {

    try {
        const user=await UserModel.create(data)
        return {
      id: user._id.toString(),
      userName: user.userName||"",
      name: user.name||"",
      email: user.email||"",
      password: user.password||34,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    } catch (error) {
        
    }

    

  }

  async getUser(id: string) {

    return UserModel.findById(id)

  }

}