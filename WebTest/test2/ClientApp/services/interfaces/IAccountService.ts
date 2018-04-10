import { LoginResult } from '../models/AccountModels';

export interface IAccountService {
	Login(username: string, password: string): Promise<LoginResult>
}
