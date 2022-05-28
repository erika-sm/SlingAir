import React, { useContext, useState, useEffect } from "react";
import { FlightContext } from "./FlightContext";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const ChangeSeat = () => {
  const { seatToUpdate } = useContext(FlightContext);
  const [isLoading, setIsLoading] = useState(false);

  const [seating, setSeating] = useState({});
  const [isChecked, setIsChecked] = useState();

  const [newSeat, setNewSeat] = useState({
    _id: seatToUpdate._id,
    flightNum: seatToUpdate.flight,
  });

  let redirect = useHistory();

  useEffect(() => {
    if (seatToUpdate !== null) {
      fetch(`/getflight/${seatToUpdate.flight}`)
        .then((res) => res.json())
        .then((json) => {
          setSeating(json.data);
        });
    }
  }, []);

  const changeSeat = async () => {
    setIsLoading(true);
    try {
      const fetchUpdate = await fetch("/updatereservation", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSeat),
      });

      const updatedSeat = await fetchUpdate.json();

      if (updatedSeat.status === 200) {
        redirect.push("/view-reservations");
      }
    } catch (err) {
      return err;
    }
  };

  const handleChangeSeat = async () => {
    await changeSeat();
  };

  return (
    <SpaceWrap>
      <Wrapper>
        {Object.keys(seating) && Object.keys(seating).length > 0 ? (
          seating.map((seat) => (
            <SeatWrapper key={`seat-${seat._id}`}>
              <label>
                {seat.isAvailable ? (
                  <>
                    <Seat
                      type="radio"
                      name="seat"
                      value={seat._id}
                      onChange={(e) => {
                        setNewSeat({ ...newSeat, seat: e.target.value });
                        setIsChecked(seat._id);
                      }}
                    />
                    <Available
                      style={{
                        background:
                          seat._id === isChecked &&
                          "var(--color-alabama-crimson)",
                        color: seat._id === isChecked && "#fff",
                        fontWeight: seat._id === isChecked && 700,
                      }}
                    >
                      {seat._id}
                    </Available>
                  </>
                ) : (
                  <Unavailable>{seat._id}</Unavailable>
                )}
              </label>
            </SeatWrapper>
          ))
        ) : (
          <Circle>
            <CircularProgress />
          </Circle>
        )}
      </Wrapper>
      <ConfirmBox>
        <Details>
          <BoldText>Previous Seat:</BoldText>
          {seatToUpdate.seat}
        </Details>
        <Details>
          <BoldText>New Seat:</BoldText>
          {newSeat.seat}
        </Details>
        {isLoading ? (
          <Button disabled>
            <CircularProgress />
          </Button>
        ) : newSeat.seat ? (
          <Button onClick={handleChangeSeat}>Confirm</Button>
        ) : (
          <Button disabled>Confirm</Button>
        )}
      </ConfirmBox>
    </SpaceWrap>
  );
};

const Wrapper = styled.ol`
  display: grid;
  grid-template-rows: repeat(10, 30px);
  grid-template-columns: 30px 30px 60px 30px 30px 30px;
  gap: 12px 10px;
  background: #fff;
  border-right: 15px solid var(--color-alabama-crimson);
  border-left: 15px solid var(--color-alabama-crimson);
  margin: 24px 24px 0 0;
  padding: 48px 5px;
  height: 500px;
  width: 300px;
  position: relative;
`;
const SeatWrapper = styled.li`
  display: flex;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  height: 30px;
  width: 30px;
`;
const Seat = styled.input`
  opacity: 0;
  position: absolute;
  height: 30px;
  width: 30px;
  margin: 0;

  &:checked {
    span {
      background: var(--color-alabama-crimson);
      color: #fff;
      font-weight: 700;
    }
  }
`;
const SeatNumber = styled.span`
  border-radius: 2px;
  color: var(--color-cadmium-red);
  font-family: var(--font-body);
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
  transition: all ease 300ms;
`;
const Available = styled(SeatNumber)`
  background: #fff;
  border: 1px solid var(--color-alabama-crimson);
  cursor: pointer;

  &.checked,
  &:hover {
    background: var(--color-alabama-crimson);
    color: #fff;
    font-weight: 700;
  }
`;
const Unavailable = styled(SeatNumber)`
  background: var(--color-selective-yellow);
  cursor: not-allowed;
  opacity: 0.4;
`;

const ConfirmBox = styled.div`
  position: absolute;
  border: solid;
  border-width: 3px;
  border-color: var(--color-alabama-crimson);
  border-radius: 10px;
  height: 200px;
  width: 250px;
  padding-left: 40px;
  padding-top: 50px;
  margin-left: 400px;
  top: 40%;
  font-family: var(--font-body);
`;

const Button = styled.button`
  position: absolute;
  border: none;
  margin-top: 5px;
  width: 150px;
  left: 17%;
  top: 65%;
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

const Details = styled.div`
  display: flex;
  margin-bottom: 8px;
  font-size: 20px;
`;

const BoldText = styled.div`
  margin-right: 5px;
`;

const SpaceWrap = styled.div`
  position: absolute;
  left: 50%;
  width: 500px;
  transform: translateX(-50%);
  top: 15%;
`;

const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: 40%;
`;

export default ChangeSeat;
