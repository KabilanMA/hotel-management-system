import React from "react";
import { observer } from "mobx-react";
import UserStore from "./components/stores/UserStore";
import LoginForm from "./components/LoginForm";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ToastContainer,toast} from 'react-toastify';
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import AllModerators from "./components/admin/AllModerators";
import AllCustomers from "./components/admin/AllCustomers";
import CreateModerator from "./components/admin/CreateModerator";
import CreateCustomer from "./components/admin/CreateCustomer";
import BookingAllHotels from "./components/booking/AllHotels";
import BookingHotel from "./components/booking/Hotel";
import Booking from "./components/booking/Book";
import ModeratorDashboard from "./components/moderator/ModeratorDashboard";
import AllRooms from "./components/moderator/AllRooms";
import CreateRoom from "./components/moderator/CreateRoom";
import CreateHotel from "./components/moderator/hotel_form";
import ViewHotel from "./components/moderator/view_Hotel";
import SignupForm from "./components/admin/SignupForm";
import Interface from "./components/Interface";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID:'0'
    }
  }

  async componentDidMount() {
    try {
      let res = await fetch("https://hotel-network-manager1.herokuapp.com/isLoggedIn", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        
        credentials: 'include',
        mode:'cors'
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.modifyObservable(
          false,
          true,
          result.first_name,
          result.email,
          result.type
        );
      } else {
        UserStore.modifyObservable(false, false);
      }
    } catch (error) {
      UserStore.modifyObservable(false, false);
    }
  }

  async doLogout() {
    try {
      let res = await fetch("https://hotel-network-manager1.herokuapp.com/logout", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials:'include',
        mode:'cors'
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.modifyObservable(false, false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (UserStore.loading) {
      return (
        <div className="app">
          <div className="container">LOADING... </div>{" "}
        </div>
      );
    } else {
      if (UserStore.isLoggedIn) {
        if (UserStore.type === 0) {
          return (
            <div className="app row">
              <div className="container col-md-8">
                <Home
                  UserStore={UserStore}
                  url={window.location.href}
                  doLogout={this.doLogout}
                  type={0}
                />{" "}
                <Router>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />{" "}
                    <Route
                      path="/admin/all-customers"
                      element={<AllCustomers />}
                    />{" "}
                    <Route
                      path="/admin/all-moderators"
                      element={<AllModerators />}
                    />{" "}
                    <Route
                      path="/admin/create-customer"
                      element={<CreateCustomer />}
                    />{" "}
                    <Route
                      path="/admin/create-moderator"
                      element={<CreateModerator />}
                    />{" "}
                    <Route path="/signup" element={<SignupForm />} />{" "}
                    <Route path="*" element={<NotFound />} />{" "}
                  </Routes>{" "}
                </Router>{" "}
              </div>{" "}
            </div>
          );
        } else if (UserStore.type === 1) {
          return (
            <div className="app row">
              <div className="container col-md-8">
                <Home
                  UserStore={UserStore}
                  url={window.location.href}
                  doLogout={this.doLogout}
                  type={1}
                />{" "}
                <Router>
                  <Routes>
                    <Route path="/" element={<ModeratorDashboard />} />{" "}
                    <Route path="/moderator/all-rooms" element={<AllRooms />} />{" "}
                    <Route
                      path="/moderator/create-room"
                      element={<CreateRoom />}
                    />{" "}
                    <Route
                      path="/moderator/create-hotel"
                      element={<CreateHotel />}
                    />{" "}
                      <Route
                      path="/moderator/create-hotel/:id"
                      element={<CreateHotel />}

                    />{" "}
                    <Route
                      path="/moderator/view-hotel"
                      element={<ViewHotel />}
                    />{" "}
                       {/* <Route
                        path="/add/:id">
              <Hotel_Adding_form/>
            </Route> */}
                    <Route path="*" element={<NotFound />} />{" "}
                  </Routes>{" "}
                </Router>{" "}
              </div>{" "}
            </div>
          );
        } else {
          return (
            <div className="app row">
              <div className="container col-md-8">
                <Home
                  UserStore={UserStore}
                  url={window.location.href}
                  doLogout={this.doLogout}
                  type={2}
                />{" "}
                <Router>
                  <Routes>
                    <Route path="/" element={<BookingAllHotels />} />{" "}
                    <Route path="/hotel/:hotelID" element={<BookingHotel />} />{" "}
                    <Route path="/room/:roomID" element={<Booking />} />{" "}
                    <Route path="*" element={<NotFound />} />{" "}
                  </Routes>{" "}
                </Router>{" "}
              </div>{" "}
            </div>
          );
        }
      } else {
        return (
          <div className="app">
            <div className="container">
              <Interface state={0} />{" "}
            </div>{" "}
          </div>
        );
      }
    }
  }
}

export default observer(App);
