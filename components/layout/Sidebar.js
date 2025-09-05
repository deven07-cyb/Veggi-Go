'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { navigateTo, getUserRoleName, getUserRolePermission } from '@/components/common/functions';
import RoleList from "@/components/common/RoleList";

export default function Sidebar() {
	const pathname = usePathname()
	const [currentMenuItem, setCurrentMenuItem] = useState("")
	const router = useRouter();
	const roleName = getUserRoleName();
	useEffect(() => {
		setCurrentMenuItem(pathname)
	}, [pathname])

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current" : ""
	const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current" : ""

	const [isAccordion, setIsAccordion] = useState(1)

	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('tokenExpiration');
		localStorage.removeItem('isLoggedIn');
		router.push('/');
	}
	return (
		<>

			<div className="sidebar-menu-dashboard admin-sidebar">
				<ul className="box-menu-dashboard">
					<li className={`nav-menu-item ${pathname === '/dashboard' ? 'active' : ''}`}>
						<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/dashboard')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="m20.04 6.822-5.76-4.03c-1.57-1.1-3.98-1.04-5.49.13l-5.01 3.91c-1 .78-1.79 2.38-1.79 3.64v6.9c0 2.55 2.07 4.63 4.62 4.63h10.78c2.55 0 4.62-2.07 4.62-4.62v-6.78c0-1.35-.87-3.01-1.97-3.78Z" fill="currentColor"></path><path d="M16.83 11.27a.707.707 0 0 0-.38-.38.646.646 0 0 0-.27-.05h-1.86c-.39 0-.7.31-.7.7 0 .39.31.7.7.7h.18l-2.11 2.11-1.02-1.52a.712.712 0 0 0-.51-.31.676.676 0 0 0-.56.2L7.32 15.7c-.27.27-.27.71 0 .99.14.14.31.2.49.2s.36-.07.49-.2l2.38-2.38 1.02 1.52c.12.17.3.29.51.31.22.02.41-.05.56-.2l2.72-2.72v.18c0 .39.31.7.7.7.39 0 .7-.31.7-.7v-1.86a.764.764 0 0 0-.06-.27Z" fill="currentColor"></path></svg>
							Dashboards
						</div>
					</li>
					<li
						className={`nav-menu-item dropdown2 ${(pathname === "/create-product") || (pathname === "/product-listing")
							? "active"
							: ""
							}`}
					>
						<div
							className="nav-menu-link custom-link"
							onClick={() => navigateTo(router, "/product-listing")}
						>
							{/* Product Box Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
							>
								{/* Background box with opacity */}
								<path
									opacity=".4"
									d="M12 2 2 7v10l10 5 10-5V7l-10-5Z"
									fill="currentColor"
								/>
								{/* Foreground product details */}
								<path
									d="M12 12V2M2 7l10 5 10-5M8 14l4 2 4-2"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							Products
						</div>
						<ul style={{ display: `${isAccordion == 13 ? "block" : "none"}` }}>
							<li className={`${checkCurrentMenuItem("/create-product")}`}>
								<div
									className="sidebar-sudtom-tab custom-link"
									onClick={() => navigateTo(router, "/create-product")}
								>
									Create Product
								</div>
							</li>
							<li className={`${checkCurrentMenuItem("/product-listing")}`}>
								<div
									className="sidebar-sudtom-tab custom-link"
									onClick={() => navigateTo(router, "/product-listing")}
								>
									Product List
								</div>
							</li>
						</ul>
						<div className="dropdown2-btn" onClick={() => handleAccordion(13)} />
					</li>

					<li
						className={`nav-menu-item dropdown2 ${(pathname === "/create-stock") ||
							(pathname === "/stock-listing") ||
							(pathname === "/edit-stock")
							? "active"
							: ""
							}`}
					>
						<div
							className="nav-menu-link custom-link"
							onClick={() => navigateTo(router, "/stock-listing")}
						>
							{/* Stock SVG Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
							>
								{/* Background container with opacity */}
								<path
									opacity=".4"
									d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5Z"
									fill="currentColor"
								/>
								{/* Stock upward trend line */}
								<path
									d="M7 14l3-3 3 3 4-4"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								{/* Small circle (endpoint marker) */}
								<circle cx="17" cy="10" r="1" fill="currentColor" />
							</svg>
							Stocks
						</div>
						<ul style={{ display: `${isAccordion == 5 ? "block" : "none"}` }}>
							<li className={`${checkCurrentMenuItem("/create-stock")}`}>
								<div
									className="sidebar-sudtom-tab custom-link"
									onClick={() => navigateTo(router, "/create-stock")}
								>
									Create Stock
								</div>
							</li>
							<li className={`${checkCurrentMenuItem("/stock-listing")}`}>
								<div
									className="sidebar-sudtom-tab custom-link"
									onClick={() => navigateTo(router, "/stock-listing")}
								>
									Stock List
								</div>
							</li>
						</ul>
						<div className="dropdown2-btn" onClick={() => handleAccordion(5)} />
					</li>


				</ul>
			</div>

		</>
	)
}
