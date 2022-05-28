import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FlightContext } from "../FlightContext";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const UserInput = () => {
  const {
    setResDetails,
    resDetails,
    setConfirmedRes,
    setLoggedInUser,
    setUserData,
    setAdmin,
  } = useContext(FlightContext);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let redirect = useHistory();

  const addNewReservation = async () => {
    try {
      const reservation = await fetch("/addreservation", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resDetails),
      });

      const res = await reservation.json();

      setConfirmedRes(res);
      setIsLoading(false);
      return res;
    } catch (err) {
      return err;
    }
  };

  const login = async () => {
    const fetchUser = await fetch(`/getuserdata/${resDetails.email}`);
    const user = await fetchUser.json();

    if (user.status === 200) {
      setUserData(user.data);
    }
  };

  const handleSubmit = async (e) => {
    setError(false);
    setIsLoading(true);

    e.preventDefault();
    const res = await addNewReservation();

    if (res.status === 200) {
      redirect.push("/confirmed");
      await login();
      setAdmin(false);
      setLoggedInUser(resDetails.email);
      setResDetails({
        ...resDetails,
        firstName: "",
        lastName: "",
        email: "",
        seat: null,
        flightNum: null,
      });
    } else {
      setError(true);
      setErrorMsg(res.message);
    }
  };

  return (
    <Form>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            onChange={(e) =>
              setResDetails({
                ...resDetails,
                firstName: e.target.value.toLowerCase(),
              })
            }
            placeholder="First Name"
          />
          <input
            type="text"
            required
            onChange={(e) =>
              setResDetails({
                ...resDetails,
                lastName: e.target.value.toLowerCase(),
              })
            }
            placeholder="Last Name"
          />
          <input
            type="email"
            required
            onChange={(e) =>
              setResDetails({
                ...resDetails,
                email: e.target.value.toLowerCase(),
              })
            }
            placeholder="Email"
          />
          {resDetails.name === "" ||
          resDetails.lastName === "" ||
          resDetails.seat === null ||
          resDetails.email === "" ||
          resDetails.flightNum === null ? (
            <SubmitButton disabled>Confirm</SubmitButton>
          ) : !isLoading ? (
            <SubmitButton>Confirm</SubmitButton>
          ) : (
            <Loading>
              <Spinner>
                <CircularProgress />
              </Spinner>

              <div>Processing your order</div>
            </Loading>
          )}
        </form>
        {error && <div>{errorMsg}</div>}
      </FormWrapper>
    </Form>
  );
};

const Form = styled.div`
  border: solid;
  border-width: 3px;
  border-color: var(--color-alabama-crimson);
  border-radius: 10px;
  height: 300px;
  width: 400px;
  position: absolute;
  top: 40%;
  padding-left: 20px;
  margin-left: 300px;
`;

const FormWrapper = styled.div`
  position: absolute;
  left: 50px;
  top: 50px;
`;

const SubmitButton = styled.button`
  position: absolute;
  right: 16%;
  top: 100%;
  width: 286px;
  margin-top: 5px;
  background-color: var(--color-alabama-crimson);

  &:disabled {
    opacity: 0.7;
  }

  &:hover:enabled {
    background-color: var(--color-selective-yellow);
    color: var(--color-alabama-crimson);
    border: solid;
    border-color: var(--color-alabama-crimson);
  }
`;

const Loading = styled.div`
  position: absolute;
  right: 40%;
  top: 100%;
`;

const Spinner = styled.div`
  position: absolute;
  right: 40%;
  top: 100%;
  margin-top: 10px;
`;
export default UserInput;
