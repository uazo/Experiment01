import { Action, Reducer, combineReducers } from 'redux';

export interface AuthorizeProps {
}

export interface AuthorizeState {
	isAuthenticated: boolean,
	userId: string
}

interface Login extends Action {
	type: 'USER_LOGIN',
	email: string,
	password: string 
}

export const AuthorizeActions = {
	DoLogin: (email: string, password: string) => <Login>{ type: 'USER_LOGIN', email: email, password: password }
}

export const reducer: Reducer<AuthorizeState> = (state: AuthorizeState, action: Login) => {
	if (action.type == "USER_LOGIN")
	{
		return {
			isAuthenticated: true,
			userId: "prova"
		}
	}

	return state || {
		isAuthenticated: false,
		userId: ""
	}
}
