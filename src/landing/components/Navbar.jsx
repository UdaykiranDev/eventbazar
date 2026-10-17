import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const state = useSelector(state => state.handleCart)
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top storefront-navbar">
            <div className="container">
            <NavLink className="navbar-brand fw-bold fs-4 px-2 storefront-brand" to="/" aria-label="Event Bazar home"><span className="storefront-brand-mark">E</span><span>Event Bazar</span></NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Feedback</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center storefront-actions">
                        <NavLink to="/login" className="btn btn-outline-dark"><i className="fa fa-sign-in" aria-hidden="true"></i> Login</NavLink>
                        <NavLink to="/register" className="btn btn-outline-dark"><i className="fa fa-user-plus" aria-hidden="true"></i> Register</NavLink>
                        <NavLink to="/cart" className="btn btn-outline-dark"><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart ({state.length})</NavLink>
                        <NavLink to="/admin" className="btn btn-dark"><i className="fa fa-tachometer" aria-hidden="true"></i> Admin Panel</NavLink>
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar