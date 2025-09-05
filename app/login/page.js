'use client'
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { successToast, errorToast, multiErrorToast } from "@/components/common/Toast";

export default function Login() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [sucessMessage, setSucessMessage] = useState(false);
	const router = useRouter();
	const validationSchema = Yup.object({
		email_address: Yup.string()
			.email("Please enter a valid email address format")
			.required("Email address is required"),
		password: Yup.string()
			.required("Password is required"),
	});
	const handleSubmit = async (values) => {
		try {

			let data = JSON.stringify(values);
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/get/user`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.data.status === true) {
				if ((response.data.data.userProfile.roles.name === 'admin') || (response.data.data.userProfile.roles.name === 'consultant')) {
					setSucessMessage(true);
					successToast('Admin Login Succesfully.');
					localStorage.setItem('token', response.data.data.token);
					localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

					// Set the token to expire in 1 hour (3600 seconds)
					const expirationTime = Date.now() + 3600000; // 1 hour from now
					localStorage.setItem('tokenExpiration', expirationTime);
					localStorage.setItem('role', response.data.data.userProfile.roles.name);
					localStorage.setItem('isLoggedIn', 'true');
					localStorage.setItem('comment_permission', response.data?.data?.userRolePermission?.comment || false);
					localStorage.setItem('export_permission', response.data?.data?.userRolePermission?.export || false);
					localStorage.setItem('offer_permission', response.data?.data?.userRolePermission?.offer || false);
					localStorage.setItem('write_permission', response.data?.data?.userRolePermission?.write || false);
					localStorage.setItem('read_permission', response.data?.data?.userRolePermission?.read || false);
					localStorage.setItem('parent_user_name', response.data?.data?.userRolePermission?.parentUserName || false);
					localStorage.setItem('role', response.data.data.userProfile.roles.name);

					router.push('/dashboard');
				} else {
					errorToast('This account is not an admin account.');
				}
			} else {
				errorToast(response.data.message);
			}
		} catch (error) {
			errorToast('Server Error. Please try again later.');
		}
	};
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
			<section className="flat-section admin-login">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-lg-6">
							<div className="flat-account bg-surface">
								{/* <h3 className="title text-center">Log In</h3> */}
								<div className="logo-box">
									<div className="logo">
										<Link href="/">
											<img src="/images/logo/logo.svg" alt="logo" width={174} height={44} />
										</Link>
									</div>
								</div>
								{errorMessage && <div className={messageClass}>{errorMessage}</div>}

								<Formik
									initialValues={{ email_address: "", password: "" }}
									validationSchema={validationSchema}
									onSubmit={handleSubmit}
								>
									{({ errors, touched, handleChange, handleBlur, validateForm, handleSubmit }) => (
										<Form onSubmit={async (e) => {
											e.preventDefault();
											const validationErrors = await validateForm();
											if (Object.keys(validationErrors).length > 0) {
												multiErrorToast(Object.values(validationErrors));
											} else {
												handleSubmit(); // formik will call handleSubmit from your props
											}
										}}>
											<fieldset className="box-fieldset">
												<label htmlFor="name">Email Address<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												{/* <ErrorMessage name="email_address" component="div" className="error" /> */}
											</fieldset>
											<fieldset className="box-fieldset admin-login-password">
												<label htmlFor="pass">Password<span>*</span>:</label>
												<Field
													type={showPassword ? "text" : "password"}
													id="password"
													name="password"
													onChange={handleChange}
													onBlur={handleBlur}
													style={{ width: "100%", paddingRight: "2.5rem" }}
												/>
												<span
													onClick={() => setShowPassword((prev) => !prev)}
													className="show-password"
												>
													{showPassword ? <img src="/images/favicon/password-show.png" /> : <img src="/images/favicon/password-hide.png" />}
												</span>
												{/* <ErrorMessage name="password" component="div" className="error" /> */}
											</fieldset>
											<div className="d-flex justify-content-between flex-wrap gap-12">
												<fieldset className="d-flex align-items-center gap-6">
													<Field
														type="checkbox"
														id="remeber_me"
														name="remeber_me"
														className="tf-checkbox style-2"
													/>
													<label htmlFor="cb1" className="caption-1 text-variant-1">Remember me</label>
												</fieldset>
												{/* <Link href="#modalForgotPassword" className="caption-1 text-primary" onClick={handleForgotPassword}>Forgot password?</Link> */}
												<button type="submit" className="tf-btn primary w-100">Login</button>
											</div>
										</Form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}