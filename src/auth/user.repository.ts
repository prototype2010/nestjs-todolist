import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async signUp({
    password,
    email,
    repeatPassword,
  }: SignUpDTO): Promise<void> {
    const existingUser = await this.findOne({ email });

    if (existingUser) {
      throw new ConflictException('User with such email already exists');
    }

    if (password !== repeatPassword) {
      throw new BadRequestException('Passwords should match');
    }

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt(10);
    user.password = await this.hashPassword(password, user.salt);

    await user.save();
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validatePassword({
    password,
    email,
  }: SignInDTO): Promise<string | null> {
    const user: User = await this.findOne({ email });

    if (user && (await user.isPasswordValid(password))) {
      return user.email;
    } else {
      return null;
    }
  }
}
