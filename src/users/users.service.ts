import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private currentId = 1;

  create(createUserDto: CreateUserDto): User {
    const newUser = new User({
      id: this.currentId++,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = new User({
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    });

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return { message: `User with ID ${id} has been successfully deleted` };
  }

  // Additional utility methods
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  getUserCount(): number {
    return this.users.length;
  }

  clearAllUsers(): { message: string } {
    this.users = [];
    this.currentId = 1;
    return { message: 'All users have been cleared' };
  }
}
