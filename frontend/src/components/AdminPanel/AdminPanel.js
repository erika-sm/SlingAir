import React, { useContext, useState } from "react";
import AdminPlane from "./AdminPlane.js";
import styled from "styled-components";
import { FlightContext } from "../FlightContext.js";
import AllReservations from "./AllReservations.js";

const AdminPanel = ({}) => {
  const { admin } = useContext(FlightContext);
  const [selectedFlight, setSelectedFlight] = useState();
  const [isDeleting, setIsDeleting] = useState();
  return (
    <>
      {admin ? (
        <Wrapper>
          <AdminPlane selectedFlight={selectedFlight} isDeleting={isDeleting} />
          <AllReservations
            setSelectedFlight={setSelectedFlight}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
          />
        </Wrapper>
      ) : (
        <Denied>Access Denied</Denied>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  overflow: auto;
  justify-content: center;
  margin-left: -270px;
`;

const Denied = styled.div`
  font-family: var(--font-body);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-alabama-crimson);
  font-size: 50px;
`;

export default AdminPanel;
