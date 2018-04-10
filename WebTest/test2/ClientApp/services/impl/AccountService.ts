import { injectable } from "inversify";
import { lazyInject } from "../../container";

import { API_TYPES, IAccountApi } from '../../api/interfaces';
import { LoginResultModelApi } from '../../api/models/AccountModels';

import { IAccountService } from '../interfaces/IAccountService';
import { LoginResult } from '../models/AccountModels';

@injectable()
export class AccountService implements IAccountService {

	@lazyInject(API_TYPES.IAccountApi) private _accountApi: IAccountApi;

	// Login
	Login(username: string, password: string): Promise<LoginResult> {
		return new Promise<LoginResult>((resolve, reject) => {
			this._accountApi.loginAsync(username, password)
				.then(x => resolve(x))
		});
	}

}
