import { Request, Response, NextFunction } from "express";
import { hashPassword, verifyPassword } from '../../utils/passwordHasher';
import { generateToken } from '../../utils/jwtToken';
import { MongoUserRepository } from './../repository/user.repository.impl';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/errors/AppError';

const repo = new MongoUserRepository();
const normalize = (value: string) => value.trim().toLowerCase();
export const addUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, userName, email, password } = req.body;
  const normalizedUserName = normalize(String(userName));
  const normalizedEmail = normalize(String(email));

  if ([firstname, lastname, userName, email, password].some((v) => !v || typeof v !== 'string' || v.trim() === "")) {
    return next(new AppError("All fields are required", 400));
  }
  // userName = String(userName).toLocaleLowerCase();
  const existingUserName = await repo.findByUserName(userName);
  if (existingUserName) {
    return next(new AppError("Username already exists", 409));
  }

  const existingEmail = await repo.findByEmail(email);
  if (existingEmail) {
    return next(new AppError("Email already exists", 409));
  }

  const hashResult = await hashPassword(password);
  if (!hashResult.success || !hashResult.hash) {
    return next(new AppError(`Error hashing password: ${hashResult.error}`, 500));
  }

  const name = `${firstname} ${lastname}`.trim();

  const newUser = await repo.createUser({
    userName,
    name,
    email,
    password: hashResult.hash
  });

  // Generate JWT token
  const token = generateToken((newUser as any)._id || (newUser as any).id, newUser.email);

  // Set cookie with JWT
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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

export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userName, email, password } = req.body;

  if (!password || (!userName && !email)) {
    return next(new AppError("Please provide username/email and password", 400));
  }




  const normalizedUserName = userName ? normalize(String(userName)) : null;
  const normalizedEmail = email ? normalize(String(email)) : null;

  let user: any;

  if (normalizedEmail) {
    user = await repo.findByEmail(normalizedEmail);
  } else if (normalizedUserName) {
    user = await repo.findByUserName(normalizedUserName);
  }

  if (!user) {
    return next(new AppError("Invalid user ", 401));
  }

  const isMatch = await verifyPassword(password, user.password);

  if (!isMatch.success || !isMatch.isValid) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Generate JWT token
  const token = generateToken(user._id || user.id, user.email);

  // Set cookie with JWT
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: user._id || user.id,
      userName: user.userName,
      email: user.email,
      name: user.name,
    }
  });
});