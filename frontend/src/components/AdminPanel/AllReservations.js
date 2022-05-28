import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const AllReservations = ({ setSelectedFlight, isDeleting, setIsDeleting }) => {
  const [flights, setFlights] = useState({});

  const [allRes, setAllRes] = useState([]);
  const [filter, setFilter] = useState({});

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/getflights/admin")
      .then((res) => res.json())
      .then((json) => {
        setFlights(json.data);
      });
  }, []);

  let query = "";

  const fetchReservations = async () => {
    setErrorMsg("");
    setIsLoading(true);
    let getReservations;

    if (filter.givenName) {
      query += `&givenName=${filter.givenName}`;
    }
    if (filter.surname) {
      query += `&surname=${filter.surname}`;
    }
    if (filter.email) {
      query += `&email=${filter.email}`;
    }
    if (filter._id) {
      query += `&_id=${filter._id}`;
    }
    if (filter.seat) {
      query += `&seat=${filter.seat}`;
    }
    if (filter.flight) {
      query += `&flight=${filter.flight}`;
    }

    if (query.length > 0) {
      getReservations = await fetch(`/getfilteredreservations/?${query}`);
    } else {
      getReservations = await fetch("/getfilteredreservations/");
    }
    const reservations = await getReservations.json();

    if (reservations.status === 200) {
      setAllRes(reservations.data);
      setIsLoading(false);
    } else {
      setErrorMsg(reservations.message);
      setIsLoading(false);
      setAllRes([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  return (
    <Wrapper>
      <BannerWrapper>
        <form onSubmit={handleSubmit}>
          <Select
            name="Select Flight"
            onChange={(e) => {
              setSelectedFlight(e.target.value);
              if (e.target.value !== "allFlights")
                setFilter({ ...filter, flight: e.target.value });
              else setFilter({ ...filter, flight: null });
            }}
          >
            <option value="allFlights" default>
              All Flights
            </option>

            {Object.keys(flights).length > 0 &&
              flights.map((flight) => (
                <option key={flight._id} value={flight._id}>
                  {flight._id}
                </option>
              ))}
          </Select>
          <Tag>
            Given Name
            <Input
              type="text"
              onChange={(e) => {
                setFilter({
                  ...filter,
                  givenName: e.target.value.toLowerCase(),
                });
              }}
            />
          </Tag>
          <Tag>
            Surname
            <Input
              type="text"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  surname: e.target.value.toLowerCase(),
                })
              }
            />
          </Tag>
          <Tag>
            Email
            <Input
              type="email"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  email: e.target.value.toLowerCase(),
                })
              }
            />
          </Tag>
          <Tag>
            Seat
            <Input
              type="text"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  seat: e.target.value.toUpperCase(),
                })
              }
            />
          </Tag>{" "}
          <Tag>
            Reservation#
            <Input
              type="text"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  _id: e.target.value.toLowerCase(),
                })
              }
            />
          </Tag>
          <SubButton>Submit</SubButton>
        </form>
      </BannerWrapper>
      {isLoading ? (
        <LoadingCircle>
          <CircularProgress />
        </LoadingCircle>
      ) : allRes.length > 0 ? (
        <ReservationWrapper>
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
        </ReservationWrapper>
      ) : errorMsg ? (
        <FilterMsg>{errorMsg}</FilterMsg>
      ) : (
        <FilterMsg>Use the filter to search for reservations.</FilterMsg>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  font-family: var(--font-body);
  overflow: auto;
`;

const BannerWrapper = styled.div`
  background-color: var(--color-alabama-crimson);
  font-family: var(--font-body);
  color: white;
  font-size: 32px;
  padding-left: 20px;

  padding-bottom: 10px;
  position: absolute;
  margin-left: 500px;
  width: 175px;
  height: 500px;
`;

const Select = styled.select`
  width: 100px;
  height: 30px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 15px;
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
  margin-bottom: 12px;
  text-transform: capitalize;
`;

const LowerDetails = styled.div`
  display: flex;
  margin-bottom: 12px;
  text-transform: lowercase;
`;

const UpperDetails = styled.div`
  display: flex;
  margin-bottom: 12px;
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
  width: 450px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  margin-top: 5px;
  margin-left: -50px;

  width: 100px;
  background-color: var(--color-alabama-crimson);
  border: none;
  height: 50px;
  font-size: 15px;
  font-family: var(--font-body);

  &:hover:enabled {
    background-color: var(--color-desert-sand);
    color: var(--color-alabama-crimson);
    border: solid;
    border-color: var(--color-alabama-crimson);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Tag = styled.div`
  font-size: 15px;
`;

const Input = styled.input`
  width: 100px;
  height: 30px;
  font-size: 13px;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const ReservationWrapper = styled.div``;

const FilterMsg = styled.div`
  width: 450px;
  display: flex;
  justify-content: center;
  margin-top: 200px;
  font-weight: bold;
  font-size: 20px;
`;

const SubButton = styled.button`
  padding: 10px;
  margin-top: 30px;
  margin-left: 20px;
  font-family: var(--font-body);
  border: solid
  width: 150px;
 
  background-color: var(--color-selective-yellow);
  border: none;
  font-size: 25px;

  &:hover:enabled {
    background-color: var(--color-desert-sand);
    color: var(--color-alabama-crimson);
    border: solid;
    border-color: var(--color-alabama-crimson);
  }
`;

export default AllReservations;
