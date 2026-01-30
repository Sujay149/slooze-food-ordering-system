import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Country } from '../common/types';

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@food.com',
    password: bcrypt.hashSync('admin123', 10),
    role: UserRole.ADMIN,
    country: Country.INDIA,
  },
  {
    id: '2',
    name: 'Manager India',
    email: 'manager.india@food.com',
    password: bcrypt.hashSync('manager123', 10),
    role: UserRole.MANAGER,
    country: Country.INDIA,
  },
  {
    id: '3',
    name: 'Manager America',
    email: 'manager.america@food.com',
    password: bcrypt.hashSync('manager123', 10),
    role: UserRole.MANAGER,
    country: Country.AMERICA,
  },
  {
    id: '4',
    name: 'Member India',
    email: 'member.india@food.com',
    password: bcrypt.hashSync('member123', 10),
    role: UserRole.MEMBER,
    country: Country.INDIA,
  },
  {
    id: '5',
    name: 'Member America',
    email: 'member.america@food.com',
    password: bcrypt.hashSync('member123', 10),
    role: UserRole.MEMBER,
    country: Country.AMERICA,
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = mockUsers.find((u) => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role,
      country: user.country,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
      },
    };
  }

  findUserById(id: string): User | undefined {
    return mockUsers.find((u) => u.id === id);
  }

  getAllUsers(): User[] {
    return mockUsers.map(({ password, ...user }) => user as any);
  }
}
