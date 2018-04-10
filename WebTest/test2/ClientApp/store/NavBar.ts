import * as React from 'react';
import { Action, Reducer, combineReducers } from 'redux';

import actionCreatorFactory from "typescript-fsa";
const actionCreator = actionCreatorFactory();
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { ImmutableObj } from './util';

export interface NavBarState {
	items: NavBarItem[];
	isCollapsed?: boolean;
	showSubMenu?: boolean;

	currentItem: NavBarItem;
}

export class NavBarItem {
	key: string;
	title: string;
	icon: string;
	locked: boolean;

	selected?: boolean;
	groups: NavBarGroup[];
}

export class NavBarGroup {
	key: string;
	title: string;
	icon: string;

	opened?: boolean;
	childrens?: NavBarItem[];
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
					key: "1_1", title: "1", icon: "fa-fw fa fa-home",
					childrens: [
						{ key: "1_1_1", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null },
						{ key: "1_1_2", title: "ppp", icon: "fa-fw fa fa-home", locked: false, groups: null }
					]
				},
				{
					key: "2_1", title: "2", icon: "fa-fw fa fa-home",
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

export const NavActions = {
	changeSubMenu: actionCreator<boolean>("NAV_CHANGESUBMENU"),
	changeMore: actionCreator<boolean>("NAV_CHANGEMORE"),
	selectMenuItem: actionCreator<NavBarItem>("NAV_SELECTMENUITEM"),
	changeCollapsed: actionCreator<boolean>("NAV_CHANGECOLLAPSED"),
	setGroupCollaseState: actionCreator<{ group: NavBarGroup, opened: boolean }>("NAV_SETGROUPCOLLASED")
}

export const reducer = reducerWithInitialState(INITIAL_STATE)
	.case(NavActions.changeSubMenu, (state, value) => {
		return new ImmutableObj(state)
			.into(x => x.showSubMenu)
			.set(value)
			.apply().toObject();
	})

	.case(NavActions.selectMenuItem, (state, item) => {
		if (item.groups == null) return state;

    var newState = new ImmutableObj(state);
		newState.foreach(x => x.items).into(x => x.selected).set(false).apply();

    if (item === state.currentItem || item == null) {
      newState.into(x => x.showSubMenu).set(false).apply();
    }
    else {
      var selectedItem: NavBarItem;
      newState
				.foreach(x => x.items).first(x => x.key == item.key).capture(x => selectedItem = x).into(x => x.selected).set(true).apply()
				.into(x => x.currentItem).set(selectedItem).apply()
				.into(x => x.showSubMenu).set(true).apply();
    }

    return newState.toObject();
	})
	
	.case(NavActions.changeCollapsed, (state, value) => { 
		return new ImmutableObj(state)
			.into(x => x.isCollapsed)
			.set(value)
			.apply().toObject();
	})

  .case(NavActions.changeMore, (state, value) => {
		return new ImmutableObj(state)
			.into(x => x.showSubMenu).set(value).apply()
			.foreach(x => x.items).into(x => x.selected).set(false).apply()
			.into(x => x.currentItem).set(null).apply()
			.toObject();
	})

	.case(NavActions.setGroupCollaseState, (state, value) => {
		var { group, opened } = value;

		var selectedItem;
		var ns = new ImmutableObj(state)
			.foreach(x => x.items).capture(x => selectedItem = x).each(x => x.groups).first(x => x == value.group).into(x => x.opened).set(value.opened).apply()
			.into(x => x.currentItem).set(selectedItem).apply()
			.toObject();

		return ns;
	})

.build();
















function example() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		debugger;
	};
}
function example2() {
	return function (target: any, propertyKey: string, parameterIndex: Number) {
		debugger;
	};
}


var old = {
	prova: 12,
	pluto: {
		a: 1,
		b: 2
	}
}

//var im = new immutableObj(old);
//var newo = im.in(x => x.pluto).in(x => x.a).set(13).reduce();

//console.log(old.pluto);
//console.log(newo.pluto);
//console.log(old.pluto === newo.pluto);
//console.log(old === newo);

//var a2 = im.set(13);



