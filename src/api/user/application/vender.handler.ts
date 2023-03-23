import { ProductMapper } from '@PRODUCT/domain';
import { HttpExceptionFactory } from '@COMMON/exception';
import { IProduct } from '@INTERFACE/product';
import { IUserRepository } from '@INTERFACE/user';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryToken } from '@USER/_constants_';
import { Nullish } from '@UTIL';

export class FindVenderCommand implements ICommand {
  constructor(readonly id: string) {}
}

@CommandHandler(FindVenderCommand)
export class FindVenderHandler implements ICommandHandler<FindVenderCommand> {
  constructor(
    @Inject(UserRepositoryToken) private readonly repository: IUserRepository,
  ) {}

  async execute(command: FindVenderCommand): Promise<IProduct.Vender> {
    const user = await this.repository.findOne(command.id);
    if (Nullish.is(user)) {
      throw HttpExceptionFactory('NotFound');
    }
    return ProductMapper.toVender(user);
  }
}

export class FindManyVenderCommand implements ICommand {
  constructor(readonly ids: string[]) {}
}

@CommandHandler(FindManyVenderCommand)
export class FindManyVenderHandler
  implements ICommandHandler<FindManyVenderCommand>
{
  constructor(
    @Inject(UserRepositoryToken) private readonly repository: IUserRepository,
  ) {}

  async execute(command: FindManyVenderCommand): Promise<IProduct.Vender[]> {
    const list = await this.repository.findManyByIds(command.ids);
    return list.map(ProductMapper.toVender);
  }
}
