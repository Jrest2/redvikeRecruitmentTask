import { prisma } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse, UserPayload } from "./interfaces/auth.interface";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Inject } from "@nestjs/common";
import { UserService } from "../user/services/user.service";

export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(UserService) private userService: UserService,
  ) {}
  
  async validateUser(email: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  }

  async login({ email }: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(email);
    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(userWithoutPassword);
    return { user: userWithoutPassword, tokens };
  }

  private async generateTokens(user: UserPayload) {
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  private async generateAccessToken(sub: string) {
    return this.jwtService.signAsync({ sub });
  }

  private async generateRefreshToken(sub: string): Promise<string> {
    return this.jwtService.signAsync({ sub }, { expiresIn: "7d" });
  }
}
