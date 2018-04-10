import * as React from 'react';
import { connect } from 'react-redux';

import { TextField, SearchBox } from 'office-ui-fabric-react';

import { NavBarState, NavBarItem, NavBarGroup, NavActions } from '../../store/NavBar'
import { ApplicationState } from '../../store';

import { NavBarPanelController } from '../../controllers/ui/NavBarPanelController'

type navprops = NavBarState & typeof NavActions;

class NarBarPanel extends React.Component<navprops, {}> {
	private renderItem(callback: (value: NavBarItem) => boolean, list: NavBarItem[] = this.props.items): JSX.Element[] {
		var { props, actions } = { props: this.props as NavBarState, actions: this.props as typeof NavActions };

		return list
			.map(x => {
			if (callback(x) == true) {
				return (
					<li key={"item" + x.key} className={"list-item __animated" + (x.groups != null && x.groups.length > 0 ? " __has-dropdown" : "")
						+ (x.selected == true ? " __selected" : "")
						+ (x.locked == true ? "" : " __draggable")
						+ (x.groups != null && x.groups.length > 0 ? "  __more" : "")
					}
						onClick={(e) => { e.preventDefault(); actions.selectMenuItem(x); } }
						va-tooltip={x.title}>
						<a className="list-link" href="">
							<i className={"list-ico " + x.icon}></i>
							<span className="list-name">{x.title}</span>
						</a>
					</li>
				)
			}
		});
	}

	render() {
		var { props, actions } = { props: this.props as NavBarState, actions: this.props as typeof NavActions };

		var currentItemGroup = props.currentItem == null || props.currentItem.groups == null ? null : props.currentItem.groups.map(g => (
			<div key={"itemgroup_" + props.currentItem.key + "_" + g.key}>
				<div key={"group" + g.key}
						className={"list-group" + (g.opened == true ? '__opened' : '')}
						onClick={(e) => actions.setGroupCollaseState({ group: g, opened: !g.opened }) }>
					{ g.title }
				</div>
				<ul className="list __sub">
					{this.renderItem(x => true, g.childrens)}
				</ul>
			</div>
		));

		return (
			<nav className={"nav-bar" + (props.isCollapsed == true ? " __collapsed" : "") }>
				<div className="bar">
					<div className="wrapper">
						<div className="list __items" va-tooltip-options tooltip-enable={props.isCollapsed}
							tooltip-append-to-body="true" tooltip-placement="right"
							tooltip-animation="false">

							<div className="list-item" onClick={(e) => actions.changeCollapsed(!props.isCollapsed)}>
								<a className="list-link">
									<i className="list-ico fa fa-fw fa-bars"></i>
								</a>
							</div>

							<ul>
								{ this.renderItem( x=> x.locked == true ) }
							</ul>

							<div className="divider"></div>

							<div className="outer-wrapper">
								<div className="inner-wrapper">
									<div className="content">
										<ul ui-sortable="sortableOptions">
											{this.renderItem(x => x.locked == false)}
											<li className="list-item __animated __has-dropdown __more" onClick={(e) => { e.preventDefault(); actions.changeMore(true) }}>
												<a className="list-link" href="">
													<span className="list-name">More</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>

				<div className={"dropdown __more" + (props.showSubMenu ? " __opened" : "")}>
					<a className="dropdown-close" onClick={(x) => actions.changeMore(!props.showSubMenu) }>×</a>

					<div className="dropdown-head">
						<div className="form-group">
							<div className="form-hint">platform.menu.toggle-favorites</div>
							<div className="form-input __search">
								<SearchBox/>
							</div>
						</div>
					</div>

					<div className="dropdown-content">
						<ul className="list __items">
							{props.currentItem == null ? this.renderItem(x => true) : currentItemGroup}
						</ul>
					</div>

				</div>
			</nav>
		);
	}
}
export default connect(
	(state: ApplicationState) => state.navigation, // mapStateToProps
	NavActions // NavBarPanelController.CreateActions() // mapDispatchToProps
)(NarBarPanel);