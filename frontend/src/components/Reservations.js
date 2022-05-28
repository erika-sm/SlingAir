import React, { useContext, useEffect, useState } from "react";
import { FlightContext } from "./FlightContext";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Reservations = () => {
  const { loggedInUser, setSeatToUpdate, seatToUpdate } =
    useContext(FlightContext);
  const [allRes, setAllRes] = useState([]);
  const [isDeleting, setIsDeleting] = useState();
  const [resAvail, setResAvail] = useState(true);

  let redirect = useHistory();

  const fetchReservations = async () => {
    const getReservations = await fetch(
      `/getfilteredreservations?email=${loggedInUser}`
    );
    const reservations = await getReservations.json();

    if (reservations.status === 200) {
      setAllRes(reservations.data);
    } else {
      setResAvail(false);
    }
  };

  const deleteReservation = async (resId) => {
    setIsDeleting(resId);
    const deleteRes = await fetch(`/deletereservation/${resId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const message = await deleteRes.json();

    if (message.status === 200) {
      await fetchReservations();

      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleChangeSeat = () => {
    redirect.push("/change-seat");
  };

  return (
    <Wrapper>
      {!resAvail ? (
        <div>Nothing to see here</div>
      ) : allRes.length > 0 ? (
        <div>
          {allRes.map((res) => (
            <ReservationBox key={res._id}>
              <LowerDetails>
                <BoldText style={{ fontWeight: "bold" }}>
                  Reservation #:
                </BoldText>{" "}
                <Res> {res._id}</Res>
              </LowerDetails>
              <UpperDetails>
                <BoldText style={{ fontWeight: "bold" }}>Flight #:</BoldText>{" "}
                {res.flight}
              </UpperDetails>
              <UpperDetails>
                <BoldText style={{ fontWeight: "bold" }}>Seat #:</BoldText>{" "}
                {res.seat}
              </UpperDetails>
              <Details>
                <BoldText style={{ fontWeight: "bold" }}>Name #:</BoldText>{" "}
                {res.givenName} {res.surname}
              </Details>
              <LowerDetails>
                <BoldText style={{ fontWeight: "bold" }}>Email #:</BoldText>{" "}
                {res.email}
              </LowerDetails>
              <ButtonWrapper>
                <Button
                  onClick={() => {
                    setSeatToUpdate({
                      ...seatToUpdate,
                      _id: res._id,
                      flight: res.flight,
                      seat: res.seat,
                    });
                    handleChangeSeat();
                  }}
                >
                  Change Seats
                </Button>
                {isDeleting === res._id ? (
                  <Button>
                    <CircularProgress />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      deleteReservation(res._id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </ButtonWrapper>
            </ReservationBox>
          ))}
        </div>
      ) : (
        <LoadingCircle>
          <CircularProgress />
        </LoadingCircle>
      )}
    </Wrapper>
  );
};

export default Reservations;

const Wrapper = styled.div`
  display: block;
  overflow: auto;
  margin: auto auto 24px;
  margin-top: 10px;
  font-family: var(--font-body);
`;

const ReservationBox = styled.div`
  border: solid;
  border-width: 3px;
  border-color: var(--color-alabama-crimson);
  border-radius: 10px;
  height: 250px;
  width: 450px;
  margin-bottom: 10px;
  font-size: 20px;
  padding-left: 50px;
  padding-top: 20px;
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
  margin-top: 5px;
  font-size: 13px;
`;

const LoadingCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const Button = styled.button`
  margin-top: 20px;
  margin-left: -50px;
  border-radius: 5px;
  width: 100px;
  background-color: var(--color-alabama-crimson);
  border: none;
  font-size: 20px;

  &:hover:enabled {
    background-color: var(--color-selective-yellow);
    color: var(--color-alabama-crimson);
    border: solid;
    border-color: var(--color-alabama-crimson);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
