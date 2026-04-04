import { Request, Response, NextFunction } from "express";
import { hashPassword } from '../../utils/passwordHasher';
import { MongoUserRepository } from './../repository/user.repository.impl';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/errors/AppError';

const repo = new MongoUserRepository();

export const addUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, UserName, email, password } = req.body;
  
  // Validate required fields
  if ([firstname, lastname, UserName, email, password].some((v) => !v || typeof v !== 'string' || v.trim() === "")) {
    return next(new AppError("All fields are required", 400));
  }

  // Check if username already exists
  const existingUserName = await repo.findByUserName(UserName);
  if (existingUserName) {
    return next(new AppError("Username already exists", 409));
  }

  // Check if email already exists
  const existingEmail = await repo.findByEmail(email);
  if (existingEmail) {
    return next(new AppError("Email already exists", 409));
  }

  // Hash the password using our utility
  const hashResult = await hashPassword(password);
  if (!hashResult.success || !hashResult.hash) {
    return next(new AppError("Error hashing password", 500));
  }

  // Combine firstname and lastname to match our DB schema 'name'
  const name = `${firstname} ${lastname}`.trim();

  // Store in DB
  const newUser = await repo.createUser({ 
    userName: UserName, 
    name, 
    email, 
    password: hashResult.hash 
  });

  // Send success response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: (newUser as any)._id || (newUser as any).id,
      userName: newUser.userName,
      email: newUser.email,
      name: newUser.name,
    }
  });
});