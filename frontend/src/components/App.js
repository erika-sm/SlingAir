import React from "react";
import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import GlobalStyles from "./GlobalStyles";
import Profile from "./Profile";
import Login from "./Login";
import Reservations from "./Reservations";
import ChangeSeat from "./ChangeSeat";
import Admin from "./Admin";
import AdminPanel from "./AdminPanel";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />

      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/view-reservations">
            <Reservations />
          </Route>
          <Route path="/change-seat">
            <ChangeSeat />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/admin-panel">
            <AdminPanel />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
`;

export default App;
