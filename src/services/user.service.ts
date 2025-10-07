import { UserModel } from '../models/user.model';

export const createUser = async (data: { username: string; password: string; platform: string }) => {
  const user = new UserModel(data);
  return await user.save();
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const getUserByUsername = async (username: string) => {
      const user = await UserModel.findOne({ username }).
      select({ password: 0, _id: 0 ,created_at:0}).
      lean();
      return user;
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
