import cyber from "../2-utils/cyber";
import { UnauthorizedError } from "../4-models/error-models";
import Role from "../4-models/role-model";
import { IUserModel, UserModel } from "../4-models/user-model";
import {
  ICredentialsModel,
  CredentialsModel,
} from "../4-models/credentials-model";
import { ValidationError } from "./../4-models/error-models";

async function register(user: IUserModel): Promise<string> {
  // Lowercasing and trim user email:
  user.userName.toLowerCase().trim();

  // adding role to user:
  user.Role = Role.User;

  const users = await UserModel.find({
    identifyNumber: user.identifyNumber,
  }).exec();

  if (users.length > 0) {
    throw new UnauthorizedError("ID already taken, choose a different one");
  }

  // Save user to database
  const addedUser = await addUser(user);

  // Generate token:
  const token = cyber.getNewToken(addedUser);

  // Return the token:
  return token;
}

async function addUser(user: IUserModel): Promise<IUserModel> {
  // Hash password and before saving in db:
  user.password = cyber.hash(user.password);

  const errors = user.validateSync();
  if (errors) {
    throw new ValidationError(errors.message);
  }
  // Delete password before returning user:
  delete user.password;

  return user.save(); // Saves the user, update _id, return added user.
}

async function login(credentials: ICredentialsModel): Promise<string> {
  // Validate POST:
  const errors = credentials.validateSync();
  if (errors) {
    throw new ValidationError(errors);
  }
  // Hash password AND id before comparing to db:
  credentials.password = cyber.hash(credentials.password);

  const users = await CredentialsModel.find({
    userName: credentials.userName,
    password: credentials.password,
  }).exec();

  const user = users[0];

  // If user not exist:
  if (!user) {
    throw new UnauthorizedError("Incorrect username or password");
  }

  // Delete password before returning user:
  delete user.password;

  // Generate token:
  const token = cyber.getNewToken(user as IUserModel);

  // Return the token:
  return token;
}

export default {
  register,
  login,
};
