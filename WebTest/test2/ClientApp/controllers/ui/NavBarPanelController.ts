import * as React from 'react';

import { Action, Reducer, combineReducers, AnyAction, Dispatch } from 'redux';
import actionCreatorFactory from "typescript-fsa";
const actionCreator = actionCreatorFactory();

import { NavBarState, NavBarItem, NavBarGroup, NavActions } from '../../store/NavBar'

class Controller<STATE>
{
	state: STATE;
	setState(newState: STATE)
	{
		this.state = newState;
	}
}

const INITIAL_STATE: NavBarState = {
	currentItem: null,
	items: [
		{ key: "1", title: "pippo", icon: "fa-fw fa fa-home", locked: true, groups: null },
		{
			key: "2",
			title: "pluto", icon: "fa-fw fa fa-home", locked: true,
			groups: [
				{
					key: "1_1", title: "ppp", icon: "fa-fw fa fa-home",
					childrens: [
						{ key: "1_1_1", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null },
						{ key: "1_1_2", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null }
					]
				},
				{
					key: "2_1", title: "ppp2", icon: "fa-fw fa fa-home",
					childrens: [
						{ key: "2_1_1", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null },
						{ key: "2_1_2", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null }
					]
				}
			]
		},
		{
			key: "3",
			title: "paperino", icon: "fa-fw fa fa-home", locked: false,
			groups: [
				{ key: "3_1", title: "ppp3", icon: "fa-fw fa fa-home" }
			]
		}
	]
}

const SelectMenuItem = actionCreator<{ item: NavBarItem, e: React.MouseEvent<HTMLElement> }>("NAV_SELECTMENUITEM");
const ChangeSubMenu = actionCreator<boolean>("NAV_CHANGEMORE");
const ChangeCollapsed = actionCreator<boolean>("NAV_CHANGECOLLAPSED");
const ShowMore = actionCreator("NAV_SHOWMORE");
const toggleGroupCollapsedAction = actionCreator<NavBarGroup>("NAV_SETGROUPCOLLASED");
const _toggleCollapsedAction = actionCreator<NavBarGroup>("NAV_SETCOLLASED");

//const NavController = { toggleCollapsedAction }

export class NavBarPanelController extends Controller<NavBarState>
{
	static toggleCollapsedAction = actionCreator<React.MouseEvent<HTMLElement>>("NAV_TOGGLECOLLAPSED");

	static CreateActions(): any
	{
		return {
			toggleCollapsedAction: (e: React.MouseEvent<HTMLElement>) => {
				return _toggleCollapsedAction;
			}
		};
	}
	static reducer<NavBarState>()
	{
		return (state: NavBarState, action: Action) => {
			if (state == null) return INITIAL_STATE;
			return state;
		};
	}

	toggleCollapsed(e: React.MouseEvent<HTMLElement>) {
		this.state["toggleCollapsedAction"](e);
	}

	selectMenuItem(item: NavBarItem, e: React.MouseEvent<HTMLElement>) {
		//NavBarPanelController._SelectMenuItem({ item: item, e: e });
	}

	toggleMore(e: React.MouseEvent<HTMLElement>) {
	}

	showMore(e: React.MouseEvent<HTMLElement>) {
	}

	toggleGroupCollased(group: NavBarGroup) {
	}
}
