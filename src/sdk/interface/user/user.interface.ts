export type IUser = ICustomer | IVender;

export type ICustomer = IUser.IBase<'customer'>;

export interface IVender extends IUser.IBase<'vender'> {
  readonly address: string;
  /**
   * @pattern ^010-[0-9]{4}-[0-9]{4}$
   */
  readonly phone: string;
}

export namespace IUser {
  export type UserType = 'vender' | 'customer' | 'admin';

  export type OauthType = 'google' | 'github';

  export interface IAuthentication {
    /**
     * oauth server's user id
     */
    readonly sub: string;
    /**
     * oauth server type
     */
    readonly oauth_type: OauthType;
    /**
     * @format email
     */
    readonly email: string;
  }

  export interface IBase<Type extends UserType = UserType>
    extends IAuthentication {
    /**
     * 사용자 종류
     */
    readonly type: Type;

    /**
     * @format uuid
     */
    readonly id: string;

    readonly name: string;

    readonly is_deleted: boolean;

    readonly address: string | null;
    /**
     * @pattern ^010-[0-9]{4}-[0-9]{4}$
     */
    readonly phone: string | null;
    /**
     * @format datetime
     */
    readonly created_at: string;
    /**
     * @format datetime
     */
    readonly updated_at: string;
  }

  export type ISummary = Pick<IBase<UserType>, 'id' | 'name' | 'type'>;

  export interface ICreate extends IAuthentication {
    readonly name: string;
  }

  export interface IUpdate
    extends Partial<Pick<IBase, 'name' | 'address' | 'phone'>> {}
}
