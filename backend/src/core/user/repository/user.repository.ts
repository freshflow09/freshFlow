import { User } from "../types/type"

export type CreateUserDTO = {
  userName: string
  name: string
  email: string
  password: any
}

export interface UserRepository {

  createUser({}:CreateUserDTO): Promise<CreateUserDTO>

  getUser(id: string): Promise<any>

  findByUserName(userName: string): Promise<boolean>
  findByEmail(email: string): Promise<boolean>


}