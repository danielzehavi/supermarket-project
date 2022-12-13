import { RoleModel } from "./role-model";

export class UserModel {
  public _id: string;
  public firstName: string;
  public lastName: string;
  public userName: string;
  public identifyNumber: string;
  public password: string;
  public city: string;
  public street: string;
  public Role: RoleModel;
}
