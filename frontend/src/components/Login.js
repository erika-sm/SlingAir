import React, { useContext, useState } from "react";
import { FlightContext } from "./FlightContext";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const { setLoggedInUser, setUserData, setAdmin } = useContext(FlightContext);
  const [userInput, setUserInput] = useState();
  const [error, setError] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let redirect = useHistory();

  const login = async () => {
    setError(false);
    setIsLoading(true);
    try {
      const fetchUser = await fetch(`/getuserdata/${userInput}`);
      const user = await fetchUser.json();

      if (user.status === 200) {
        setLoggedInUser(user.data._id);
        setUserData(user.data);
        setUserInput("");
        setIsLoading(false);
        setAdmin(false);
        redirect.push("/");
      } else {
        setError(true);
        setErrorMsg(user.message);
        setIsLoading(false);
      }
    } catch (err) {
      return err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <div>
      <Wrapper>
        <form onSubmit={handleLogin}>
          <LoginInput
            type="text"
            required
            placeholder="Enter your email"
            onChange={(e) => setUserInput(e.target.value.toLowerCase())}
          />
          {!userInput ? (
            <LoginButton disabled>Login</LoginButton>
          ) : isLoading ? (
            <LoginButton disabled>
              <CircularProgress />
            </LoginButton>
          ) : (
            <LoginButton>Login</LoginButton>
          )}
        </form>
        {error && <div>{errorMsg}</div>}
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-72%);
`;

const LoginInput = styled.input`
  height: 50px;
`;

const LoginButton = styled.button`
  position: absolute;
  background-color: var(--color-alabama-crimson);
  margin-left: 10px;
  height: 55px;
  width: 125px;

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

export default Login;
