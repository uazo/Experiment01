import * as React from 'react';
import { connect } from 'react-redux';

import { lazyInject } from '../../container';
import { SERVICES_TYPES, IAccountService } from '../../services/interfaces';

import { TextField, PrimaryButton, IButtonProps, MessageBar, MessageBarType } from 'office-ui-fabric-react';

import WindowPanel from '../ui/window';
import * as Authorize from '../../store/Authorize';

class LoginPanelState {
	login: string;
	password: string;
	error?: string;
}

class LoginPanel extends React.Component<typeof Authorize.AuthorizeActions, LoginPanelState> {
	@lazyInject(SERVICES_TYPES.IAccountService) private _accountService: IAccountService;

	private title: string = "Login";

	constructor() {
		super();

		this.state = {
			login: "prova",
			password: ""
		};
	}

	handleSubmit() {
		this._accountService.Login(this.state.login, this.state.password)
			.then(r => {
				if (r.successfull) {
					this.props.DoLogin("", "");
				}
				else {
					this.setError(r.error);
				}
			});
	}

	setError(error: string)
	{
		this.setState({
			...this.state,
			error: error
		});
	}

	render() {
		return (
			<WindowPanel title={this.title}>

				<TextField label='Login' required={true} value={this.state.login}
					onChanged={(e) => this.setState({ login: e })}
					onGetErrorMessage={() => this.state.login == "" ? "Obbligatorio" : ""}
				/>
				<TextField type="password" label='Password' required={true} value={this.state.password}
					onChanged={(e) => this.setState({ password: e })}
					onGetErrorMessage={() => this.state.password == "" ? "Obbligatorio" : ""}
				/>

				{this.state.error ? (
					<MessageBar messageBarType={MessageBarType.error} onDismiss={() => this.setError('')}>
						{this.state.error}
					</MessageBar>
				) : null}

				<PrimaryButton
					text='Log in'
					onClick={() => this.handleSubmit()}
				/>

			</WindowPanel>
		);
	}
}

export default connect(
	null, 
	Authorize.AuthorizeActions
)(LoginPanel);
