import React from 'react';
import { Link, NavLink } from "react-router-dom";
const Header = () => {
    return ( <
        header >
        <
        nav className = "navbar navbar-dark bg-dark" >
        <
        div className = "container" >
        <
        Link to = "/"
        className = "navbar-brand" >
        Friends Book <
        /Link> <
        ul className = "navbar-nav" >
        <
        li className = "nav-item" >
        <
        NavLink to = "/register"
        className = "nav-link" > Register < /NavLink> < /
        li > <
        li className = "nav-item" >
        <
        NavLink to = "/login"
        className = "nav-link" > Login < /NavLink> < /
        li > <
        /ul> < /
        div > <
        /nav> < /
        header >
    )
}

export default Header