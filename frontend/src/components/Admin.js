import React, { useState, useContext } from "react";
import { FlightContext } from "./FlightContext";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Admin = () => {
  const [credentials, setCredentials] = useState({});
  const { setAdmin } = useContext(FlightContext);
  const [denied, setDenied] = useState(false);
  const [hint, setHint] = useState(false);

  let redirect = useHistory();

  const validateAdmin = async () => {
    setDenied(false);
    const validate = await fetch("/validateadmin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const response = await validate.json();

    if (response.status === 200) {
      setAdmin(true);
      redirect.push("/admin-panel");
    } else setDenied(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await validateAdmin();
  };

  return (
    <div>
      <UserInput onSubmit={handleLogin}>
        <input
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
          type="text"
          placeholder="Username"
        />
        <input
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
          type="password"
          placeholder="Password"
        />
        <Button>Login</Button>
        <ShowHint onClick={() => setHint(!hint)}>Show hint</ShowHint>
        {hint && (
          <Hint>
            <div>Username: admin</div> <div> Password: adminadmin</div>
          </Hint>
        )}
      </UserInput>
      <Invalid>{denied && <div>Invalid credentials</div>}</Invalid>
    </div>
  );
};

const UserInput = styled.form`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translateX(-70%);
`;

const ShowHint = styled.div`
  margin-left: 100px;
  color: var(--color-alabama-crimson);
  font-family: var(--font-body);
  cursor: pointer;
`;

const Hint = styled.div`
  background-color: var(--color-alabama-crimson);
  color: white;
  font-family: var(--font-body);
`;

const Button = styled.button`
  position: absolute;
  margin-left: 300px;
  margin-top: 20px;
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

const Invalid = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 45%;
`;

export default Admin;
