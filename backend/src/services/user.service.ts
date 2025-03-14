import UserModel from '../model/user.model';

class UserService {
  /**
   * Find the user given by email
   *
   */
  static async findUserByEmail(email: string) {
    const user = await UserModel.findUserByEmail(email);

    return user;
  }
}

export default UserService;
