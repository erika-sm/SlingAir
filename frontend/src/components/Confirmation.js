import React, { useContext } from "react";
import styled from "styled-components";
import { FlightContext } from "./FlightContext";

import tombstone from "../assets/tombstone.png";
import { CircularProgress } from "@mui/material";

const Confirmation = () => {
  const { confirmedRes } = useContext(FlightContext);

  return (
    <div>
      <Wrapper>
        {confirmedRes ? (
          <ReservationBox>
            <ConfirmedFlight>Your flight is confirmed!</ConfirmedFlight>
            <LowerDetails>
              <BoldText style={{ fontWeight: "bold" }}>Reservation #:</BoldText>{" "}
              <Res>{confirmedRes.data._id}</Res>
            </LowerDetails>
            <UpperDetails>
              <BoldText style={{ fontWeight: "bold" }}>Flight #:</BoldText>{" "}
              {confirmedRes.data.flight}
            </UpperDetails>
            <UpperDetails>
              <BoldText style={{ fontWeight: "bold" }}>Seat #:</BoldText>{" "}
              {confirmedRes.data.seat}
            </UpperDetails>
            <Details>
              <BoldText style={{ fontWeight: "bold" }}>Name #:</BoldText>{" "}
              {confirmedRes.data.givenName} {confirmedRes.data.surname}
            </Details>
            <LowerDetails>
              <BoldText style={{ fontWeight: "bold" }}>Email #:</BoldText>{" "}
              {confirmedRes.data.email}
            </LowerDetails>
          </ReservationBox>
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </Wrapper>
      <Tombstone src={tombstone} />
    </div>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
`;

const ReservationBox = styled.div`
  border: solid;
  border-width: 3px;
  border-color: var(--color-alabama-crimson);
  border-radius: 10px;
  font-family: var(--font-body);
  height: 400px;
  width: 550px;
  margin-bottom: 10px;
  font-size: 30px;
  padding-left: 25px;
  padding-left: 25px;
  padding-top: 20px;
`;

const ConfirmedFlight = styled.div`
  color: var(--color-alabama-crimson);
  border-bottom: solid;
  border-color: var(--color-alabama-crimson);
  margin-bottom: 20px;
`;

const Tombstone = styled.img`
  position: absolute;
  height: 100px;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
`;

const Details = styled.div`
  display: flex;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const LowerDetails = styled.div`
  display: flex;
  margin-bottom: 8px;
  text-transform: lowercase;
`;

const UpperDetails = styled.div`
  display: flex;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const BoldText = styled.div`
  margin-right: 5px;
  text-transform: capitalize;
`;

const Res = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;

export default Confirmation;
