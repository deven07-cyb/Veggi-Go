'use client'
import Link from "next/link"
import React from 'react';
import Menu from "../Menu"
export default function Header3({ scroll, isSidebar, handleSidebar, isMobileMenu, handleMobileMenu }) {
	return (
		<>
			<header className="main-header fixed-header header-dashboard">
				<div className="header-lower">
					<div className="row">
						<div className="col-lg-12">
							<div className="inner-container d-flex justify-content-between align-items-center">
								<div className="logo-box d-flex">
									<div className="logo"><Link href="/"><img src="/images/logo/logo.svg" alt="logo" width={174} height={44} /></Link></div>
									<div className="button-show-hide" onClick={handleSidebar}>
										<span className="icon icon-categories" />
									</div>
								</div>
								<div className="nav-outer">
									<nav className="main-menu show navbar-expand-md">
										<div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
											<Menu />
										</div>
									</nav>
								</div>
								<div className="mobile-nav-toggler mobile-button" onClick={handleMobileMenu}><span /></div>
							</div>
						</div>
					</div>
				</div>

				<div className="close-btn" onClick={handleMobileMenu}><span className="icon flaticon-cancel-1" /></div>
				<div className="mobile-menu">
					<div className="menu-backdrop" onClick={handleMobileMenu} />
					<nav className="menu-box">
						<div className="nav-logo"><Link href="/"><img src="/images/logo/logo.svg" alt="nav-logo" width={174} height={44} /></Link></div>
						<div className="bottom-canvas">
							<div className="menu-outer">
								<div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
									<ul className="navigation clearfix">
										<li><Link href="/">Logout</Link></li>
									</ul>
								</div>
							</div>

							<div className="mobi-icon-box">
								<div className="box d-flex align-items-center">
									<span className="icon icon-phone2" />
									<div>1-333-345-6868</div>
								</div>
								<div className="box d-flex align-items-center">
									<span className="icon icon-mail" />
									<div>themesflat@gmail.com</div>
								</div>
							</div>
						</div>
					</nav>
				</div>
			</header>
		</>
	)
}



