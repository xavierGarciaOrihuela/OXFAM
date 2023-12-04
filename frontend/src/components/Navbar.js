import React from "react";
import { NavLink, Outlet } from 'react-router-dom';
import { SidebarData } from "./SidebarData";
import { useNavigate } from 'react-router-dom';

import { FaRegUserCircle } from "react-icons/fa";
import { LiaSignOutAltSolid } from "react-icons/lia";

function Navbar() {

    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.setItem('currentUser', "");
        navigate('/login');
    };

    return (
        <>
            <nav className="nav-sidebar">
                <h2 className="nav-title">OXFAM</h2>
                <hr className="nav-hr"></hr>
                <div className="nav-links">
                {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className="nav-item">
                            <NavLink to={item.path} className={({isActive}) => isActive? 'nav-link nav-link-active': 'nav-link'}>
                                <span className="nav-icon">{item.icon}</span> <span>{item.title}</span>
                            </NavLink>
                        </li>
                    );
                })}
                </div>
                <div className="current-user">
                    <FaRegUserCircle  className="current-user-icon"/>
                    <p className="current-user-name">{JSON.parse(localStorage.getItem('currentUser'))}</p>
                </div>
                <button className="sign-out-button" onClick={handleSignOut}>Sign out <LiaSignOutAltSolid /></button>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
}

export default Navbar;