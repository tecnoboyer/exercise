import { UserModel } from '../models/user.model';

export const createUser = async (data: { username: string; password: string; platform: string }) => {
  const user = new UserModel(data);
  return await user.save();
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const getAllUsers = async () => {
  return await UserModel.find();
};

export const updateUser = async (id: string, data: Partial<{ username: string; password: string; platform: string }>) => {
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
