import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDidMount } from "rooks";
import { useEffectOnceWhen } from "rooks";
import { connect } from "react-redux";
import { fetchAProfile } from "../actions";
import { updateProfile } from "../actions";
import { createProfile } from "../actions";
const UserProfile = ({
  fetchAProfile,
  user,
  userId,
  updateProfile,
  createProfile,
}) => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [bio, setBio] = useState("");
  useDidMount(() => {
    if (userId && userId !== null) fetchAProfile(userId);
  });
  useEffectOnceWhen(() => {
    setName(user.name);
    setProfile(user.avatar);
    setBio(user.bio);
  }, user !== undefined);
  const handleSubmit = () => {
    const data = {
      userId,
      name,
      avatar: profile,
      bio,
    };
    user ? updateProfile({ ...data, id: user.id }) : createProfile(data);
  };
  return (
    <>
      <img
        className="ui small image"
        src={
          user
            ? user.avatar
            : "https://semantic-ui.com/images/wireframe/image.png"
        }
      />
      <h2 className="ui header">{user ? "Welcome Back" : "Hello User"}</h2>
      <div class="ui form">
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Name"
          />
        </div>
        <div class="field">
          <label>Profile Picture URL</label>
          <input
            type="text"
            value={profile}
            onChange={(e) => setProfile(e.currentTarget.value)}
            placeholder="Name"
          />
        </div>
        <div class="field">
          <label>Bio</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.currentTarget.value)}
            placeholder="Last Name"
          />
        </div>

        <button class="ui button" onClick={handleSubmit} type="submit">
          Submit
        </button>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.users[state.auth?.userId],
    userId: state.auth?.userId,
  };
};
export default connect(mapStateToProps, {
  fetchAProfile,
  updateProfile,
  createProfile,
})(UserProfile);
