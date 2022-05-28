import React, { useContext, useEffect, useState } from "react";
import { FlightContext } from "./FlightContext";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const Profile = () => {
  const { loggedInUser } = useContext(FlightContext);
  const [userData, setUserData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    const data = await fetch(`/getuserdata/${loggedInUser}`);
    const result = await data.json();

    if (result.status === 200) {
      setIsLoading(false);
      setUserData(result.data);
      setUpdatedData({ ...updatedData, _id: result.data._id });
    }
  };

  const updateUser = async () => {
    setIsUpdating(true);
    try {
      return await fetch("/updateuserdata", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      return err;
    }
  };

  const submitUserEdit = async () => {
    await updateUser();
    await fetchUser();
    setIsEditing(false);
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {!isLoading ? (
        <ProfileCard>
          {!isEditing ? (
            <div>
              {" "}
              <DataField>
                First Name: <Data> {userData.givenName}</Data>
              </DataField>
              <DataField>
                Last Name: <Data> {userData.surname}</Data>
              </DataField>
              <DataField>
                Email: <Email> {userData._id}</Email>
              </DataField>
            </div>
          ) : (
            <div>
              <DataField>
                First Name:{" "}
                <DataInput
                  type="text"
                  placeholder={userData.givenName}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      givenName: e.target.value.toLowerCase(),
                    })
                  }
                />
              </DataField>
              <DataField>
                Last Name:{" "}
                <SurnameInput
                  type="text"
                  placeholder={userData.surname}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      surname: e.target.value.toLowerCase(),
                    })
                  }
                />
              </DataField>
              <DataField>
                Email: <Email>{userData._id}</Email>
              </DataField>
            </div>
          )}
          {isEditing ? (
            <ButtonsWrapper>
              {!isUpdating ? (
                <div>
                  {!updatedData.givenName && !updatedData.surname ? (
                    <Button disabled>Submit</Button>
                  ) : (
                    <Button onClick={submitUserEdit}>Submit</Button>
                  )}
                  <Button onClick={handleEdit}>Cancel</Button>
                </div>
              ) : (
                <Processing> Processing your changes</Processing>
              )}
            </ButtonsWrapper>
          ) : (
            <EditWrapper>
              <EditButton onClick={handleEdit}>Edit</EditButton>
            </EditWrapper>
          )}
        </ProfileCard>
      ) : (
        <LoadingCircle>
          <CircularProgress />
        </LoadingCircle>
      )}
    </div>
  );
};

const ProfileCard = styled.div`
  position: absolute;
  height: 500px;
  width: 450px;
  margin-top: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 27px;
  font-family: var(--font-body);
  padding-left: 80px;
  color: var(--color-selective-yellow);
  padding-top: 50px;
  background-color: var(--color-alabama-crimson);
  border-radius: 10px;
`;

const LoadingCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const DataField = styled.div`
  display: flex;
  margin-bottom: 25px;
`;

const Data = styled.div`
  margin-left: 5px;
  color: white;
  text-transform: capitalize;
`;

const Email = styled.div`
  margin-left: 5px;
  color: white;
`;

const DataInput = styled.input`
  width: 100px;
  height: 20px;
  padding: 5px;
  margin-left: 5px;
`;

const Processing = styled.div`
  margin-left: -20px;
`;

const SurnameInput = styled.input`
  width: 100px;
  height: 20px;
  padding: 5px;
  margin-left: 18px;
`;

const EditWrapper = styled.div`
  position: absolute;
  top: 80%;
  margin-left: 85px;
`;

const ButtonsWrapper = styled.div`
  position: absolute;
  top: 80%;
  left: 21%;
`;

const EditButton = styled.button`
  width: 100px;
  margin-left: 15px;
  background-color: var(--color-selective-yellow);
  color: var(--color-alabama-crimson);

  &:disabled {
    opacity: 0.7;
  }

  &:hover:enabled {
    background-color: var(--color-alabama-crimson);
    color: var(--color-selective-yellow);
    border: solid;
    border-color: var(--color-selective-yellow);
  }
`;

const Button = styled.button`
  background-color: var(--color-selective-yellow);
  color: var(--color-alabama-crimson);

  padding-left: 5px;
  padding-right: 8px;
  margin-right: 5px;

  &:disabled {
    opacity: 0.7;
  }

  &:hover:enabled {
    background-color: var(--color-alabama-crimson);
    color: var(--color-selective-yellow);
    border: solid;
    border-color: var(--color-selective-yellow);
  }
`;

export default Profile;
