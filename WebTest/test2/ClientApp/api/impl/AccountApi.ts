import { injectable } from "inversify";
import { ApiRequests } from './api';

import { LoginResultModelApi } from '../models/AccountModels';
import { IAccountApi } from '../interfaces/IAccountApi'

@injectable()
export class AccountApi {
	loginAsync(email: string, password: string): Promise<LoginResultModelApi> {
		return new Promise<LoginResultModelApi>((resolve, reject) =>
			ApiRequests
				.post('/api/account/login', { email: email, password: password })
				.then(x => {
					let result: LoginResultModelApi = Object.assign({}, x);
					resolve(result);
				})
		);
	}
}
