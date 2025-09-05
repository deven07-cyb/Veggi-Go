
'use client'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { use, useState, useEffect } from "react"
import CountetNumber from "@/components/elements/CountetNumber"
import DashboardChart from "@/components/elements/DashboardChart"
import DeleteFile from "@/components/elements/DeleteFile"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link";
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import LikeChart from "@/components/elements/LikeChart"
import MultiGroupChart from "@/components/chart/BarChart"
import DualLineChart from "@/components/chart/DualLineChart"
import SemicircularProgressChart from "@/components/chart/SemicircularProgressChart"
import PieChart from "@/components/chart/PieChart"
import { navigateTo } from '@/components/common/functions';
import { useRouter } from 'next/navigation';
export default function Dashboard() {
	const [loading, setLoading] = useState(false);
	const [evryDaySellingData, setEvryDaySellingData] = useState({
		fruits: {
			labels: [
				"banana", "apple", "mango", "orange", "grapes",
				"pineapple", "watermelon", "cherry", "lemon", "kiwi",
				"peach", "strawberry", "plum", "papaya", "pear"
			],
			totalKg: [100, 120, 90, 110, 95, 130, 140, 80, 70, 100, 115, 125, 105, 135, 150],
			sellingKg: [60, 80, 70, 90, 60, 100, 110, 50, 40, 75, 95, 85, 60, 100, 120],
			remainingKg: [40, 40, 20, 20, 35, 30, 30, 30, 30, 25, 20, 40, 45, 35, 30],
		},
		vegetables: {
			labels: [
				"potato", "tomato", "onion", "carrot", "cabbage",
				"cauliflower", "broccoli", "spinach", "peas", "beans",
				"cucumber", "radish", "brinjal", "ladyfinger", "pumpkin"
			],
			totalKg: [200, 180, 160, 210, 190, 170, 220, 230, 200, 180, 175, 190, 210, 195, 185],
			sellingKg: [150, 120, 100, 160, 140, 130, 180, 190, 150, 140, 135, 150, 170, 145, 155],
			remainingKg: [50, 60, 60, 50, 50, 40, 40, 40, 50, 40, 40, 40, 40, 50, 30],
		},
		meat: {
			labels: [
				"chicken", "mutton", "beef", "pork", "duck",
				"turkey", "fish", "prawns", "crab", "lamb",
				"goat", "quail", "rabbit", "camel", "buffalo"
			],
			totalKg: [50, 60, 70, 65, 55, 75, 80, 60, 70, 65, 85, 90, 95, 100, 110],
			sellingKg: [30, 40, 50, 45, 35, 55, 60, 40, 50, 45, 65, 70, 75, 80, 85],
			remainingKg: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 25],
		},
	});

	return (
		<>
			{
				loading ? (
					<Preloader />
				) : (
					<>
						<DeleteFile />
						<LayoutAdmin>

							<div className={` dashboard-section`}>
								<div className="data-section">
									<div className="dashboard-inner-content">
										<div className="counter-section-info">
											<h5>Today's Data</h5>
											<span>Data Summary</span>
										</div>
										<div className="flat-counter-v1 tf-counter counter-section-detail">
											<div
												className="project-count custom-link"
											>
												<div className="flat-counter-vv2 tf-counter" onClick={() => navigateTo(router, '/user-listing')}>
													<div className="content-box inner-content-detail">
														<div className="number" data-speed={1000} data-to='100'>
															<CountetNumber count='100' />
														</div>
														<h5>Total Orders</h5>
														<span className='success' >10% from last day</span>
													</div>
													<img src="/images/dashboard/project-icon.svg" />
												</div>
											</div>
											<div className="properties-count custom-link" onClick={() => navigateTo(router, '/developer-listing')}>
												<div className="flat-counter-vv2 tf-counter ">
													<div className="content-box inner-content-detail" >
														<div className="number" data-speed={1000} data-to='17'><CountetNumber count='17' /></div>
														<h5>Pending Orders</h5>
													</div>
													<img src="/images/dashboard/properties-icon.svg" />
												</div>
											</div>

											<div className="likes-count custom-link" onClick={() => navigateTo(router, '/agency-listing')}>
												<div className="flat-counter-vv2 tf-counter ">
													<div className="content-box inner-content-detail">
														<div className="number" data-speed={1000} data-to='16458'><CountetNumber count='16458' /></div>
														<h5>Total Earnings</h5>
														<span className='error' >-20% from last day</span>
													</div>
													<img src="/images/dashboard/likes-icon.svg" />
												</div>
											</div>
											<div className="likes-count custom-link" onClick={() => navigateTo(router, '/project-listing')}>
												<div className="flat-counter-vv2 tf-counter ">
													<div className="content-box inner-content-detail">
														<div className="number" data-speed={1000} data-to="3"><CountetNumber count="3" /></div>
														<h5>Total Categories</h5>
													</div>
													<img src="/images/dashboard/likes-icon.svg" />
												</div>
											</div>

											<div className="clicks-count custom-link" onClick={() => navigateTo(router, '/property-listing')}>
												<div className="flat-counter-vv2 tf-counter ">
													<div className="content-box inner-content-detail">
														<div className="number" data-speed={1000} data-to="77"><CountetNumber count='77' /></div>
														<h5>Total Products</h5>
													</div>
													<img src="/images/dashboard/clicks-icon.svg" />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="">
									<div className="activity-inner-content">
										<div className="bar-chart-container">
											<MultiGroupChart
												data={evryDaySellingData}
											/>
										</div>
									</div>
								</div>
							</div>

						</LayoutAdmin >
					</>
				)
			}
		</>
	)
}	