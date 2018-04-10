import { injectable, Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { makeProvideDecorator } from "inversify-binding-decorators";
import "reflect-metadata";

export var provide: any = () => null;
export var lazyInject: any = () => null;

var kernel = new Container();
provide = makeProvideDecorator(kernel);
lazyInject = getDecorators(kernel).lazyInject;

import { API_TYPES, IAccountApi } from './api/interfaces'
import { AccountApi } from './api/impl/AccountApi'

import { SERVICES_TYPES, IAccountService } from './services/interfaces';
import { AccountService } from './services/impl/AccountService';

export function configureContainer() {
	kernel.bind<IAccountApi>(API_TYPES.IAccountApi).to(AccountApi);
 	kernel.bind<IAccountService>(SERVICES_TYPES.IAccountService).to(AccountService);

	return kernel;
}