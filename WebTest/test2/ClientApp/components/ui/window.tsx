import * as React from 'react';

export interface IWindowProps {
	title: string;
	icon?: string;
}


export class WindowPanel extends React.Component<IWindowProps, {}> {
	render() {
		return (
			<div className="window">
				<header className="window-head">
					{this.props.icon ? <img className="__logo" src={this.props.icon} /> : null}
					<span className="window-t">{this.props.title}</span>
				</header>
				<div className="window-cnt">
					{
						this.props.children
					}
				</div>
			</div>
		);
	}
}

export default WindowPanel;