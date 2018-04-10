import { LoginResultModelApi } from '../models/AccountModels'

export interface IAccountApi 
{
	loginAsync(email: string, password: string): Promise<LoginResultModelApi>;
}