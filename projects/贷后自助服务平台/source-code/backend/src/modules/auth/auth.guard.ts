import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Public() 装饰器标记的接口跳过鉴权
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('未登录')
    }

    try {
      // 实际项目用 JWT 验证，这里简化
      const user = this.verifyToken(token)
      request.user = user
      return true
    } catch {
      throw new UnauthorizedException('登录已过期')
    }
  }

  private extractToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private verifyToken(token: string) {
    // 简化实现：实际用 JWT
    return { id: 'user_001', name: '张三' }
  }
}
