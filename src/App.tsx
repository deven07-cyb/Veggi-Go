import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserList from "./pages/Users/Business";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import SignIn from "./pages/AuthPages/SignIn";
import CountryList from "./pages/Country/Country";
import StateList from "./pages/State/State";
import CityList from "./pages/City/City";
import SubCategoryList from "./pages/SubCategory/SubCategory"
import EditSubCategory from "./pages/SubCategory/edit";
import EditCountry from "./pages/Country//edit";
import EditState from "./pages/State/edit";
import EditCity from "./pages/City/edit";
import BusinessList from "./pages/Users/Business";
import InterfaceList from "./pages/Users/Interface";
import CategoryList from "./pages/Category/Category";
import EditCategory from "./pages/Category/Edit";
import BrandList from "./pages/Brand/Brand";
import EditBrand from "./pages/Brand/Edit";
import AppSettings from "./pages/AppSettings/AppSettings";
import EditAppSettings from "./pages/AppSettings/Edit";
import OrderList from "./pages/Order/order";
import OrderView from "./pages/Order/OrderView";
import ContactList from "./pages/Contact/contact";
import EarningList from "./pages/Earnings/earning";
import BusinessView from "./pages/Users/BusinessView";
import InfluencerView from "./pages/Users/InfluencerView";
import AbuseReportList from "./pages/AbuseReport/abuseReport";






const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const tokenExpireTime = localStorage.getItem("tokenExpireTime");

  if (!isLoggedIn || (tokenExpireTime && Date.now() > parseInt(tokenExpireTime))) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Route */}
          <Route path="/" element={<SignIn />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/user/business" element={<BusinessList />} />  {/* Add this route */}
            <Route path="/user/influencer" element={<InterfaceList />} />
            <Route path="/country" element={<CountryList />} />
            <Route path="/country/detail" element={<EditCountry />} />  {/* Add this route */}
            <Route path="/state" element={<StateList />} />
            <Route path="/state/detail" element={<EditState />} />
            <Route path="/city" element={<CityList />} />
            <Route path="/city/detail" element={<EditCity />} />
            <Route path="/category" element={<CategoryList />} />
            <Route path="/category/detail" element={<EditCategory />} />
            <Route path="/sub-category" element={<SubCategoryList />} />
            <Route path="/sub-categories/detail" element={<EditSubCategory />} />
            <Route path="/brand" element={<BrandList />} />
            <Route path="/brand/detail" element={<EditBrand />} />
            <Route path="/app-settings" element={<AppSettings />} />
            <Route path="/app-settings/detail" element={<EditAppSettings />} />
            <Route path="/order" element={<OrderList />} />
            <Route path="/order/view" element={<OrderView />} />
            <Route path="/contact" element={<ContactList />} />
            <Route path="/earning" element={<EarningList />} />
            <Route path="/business/view" element={<BusinessView />} />
            <Route path="/user/influencer/view" element={<InfluencerView />} />
            <Route path="/abuse-reports" element={<AbuseReportList />} />






          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
