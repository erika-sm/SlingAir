import React, { useState } from "react";

export const FlightContext = React.createContext();

export const FlightProvider = ({ children }) => {
  const [resDetails, setResDetails] = useState({
    flightNum: null,
    seat: null,
    firstName: "",
    lastName: "",
    email: "",
  });

  const [confirmedRes, setConfirmedRes] = useState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [userData, setUserData] = useState();
  const [seatToUpdate, setSeatToUpdate] = useState({});
  const [admin, setAdmin] = useState(false);

  return (
    <FlightContext.Provider
      value={{
        resDetails,
        setResDetails,
        confirmedRes,
        setConfirmedRes,
        loggedInUser,
        setLoggedInUser,
        userData,
        setUserData,
        seatToUpdate,
        setSeatToUpdate,
        admin,
        setAdmin,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};
