import React from "react";
import Plane from "./Plane";
import UserInput from "./UserInput";
import SelectFlight from "./SelectFlight";
import styled from "styled-components";

const SeatSelect = ({}) => {
  return (
    <>
      <SelectFlight />
      <h2>Select your seat and Provide your information!</h2>
      <Wrapper>
        <Plane />
        <UserInput />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default SeatSelect;
