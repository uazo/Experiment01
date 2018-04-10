import * as React from 'react';
import { NavMenu } from './NavMenu';
import Authorize from './Authorize';
import NarBarPanel from './ui/NavBarPanel'

//import * as p from '../css/themes/main/reset.css'
//import 'typings-for-css-modules-loader!../css/reset_x.css';
//import '../css/reset_x.css';

export class Layout extends React.Component<{}, {}> {

	//navItems: NavBarItem[] = [
	//	{ title: "pippo", icon: "fa-fw fa fa-home" },
	//	{ title: "pluto", icon: "fa-fw fa fa-home" },
	//	{ title: "paperino", icon: "fa-fw fa fa-home" }
	//];

	public render() {
		return (
			<Authorize>
				<NarBarPanel/>

				<div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-3'>
                    <NavMenu />
                </div>
                <div className='col-sm-9'>
                    { this.props.children }
                </div>
            </div>
				</div>
			</Authorize>
			);
    }
}
