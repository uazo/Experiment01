import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Authorize from '../store/Authorize';

import LoginPanel from './security/login';

type AuthorizeProps =
	Authorize.AuthorizeProps
	& Authorize.AuthorizeState
	& typeof Authorize.AuthorizeActions;

class AuthorizeInternal extends React.Component<AuthorizeProps, {}> {
	//public static defaultProps: Partial<UserLoginProps> = {
	//	isAuthenticated: false
	//};

	componentWillMount()
	{
	}

	login() {
		this.props.DoLogin("pp", "blabla");
	}

	public render() {
		if (this.props.isAuthenticated == true)
			return (
				<div>
					{this.props.children}
				</div>
		);
		else
			return (
				<LoginPanel>
				</LoginPanel>
		);
	}
}

export default connect(
	(state: ApplicationState) => state.authorize,
	Authorize.AuthorizeActions
)(AuthorizeInternal) /*as typeof UserLoginInternal*/;
