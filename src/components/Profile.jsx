import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEffectOnceWhen, useDidMount } from 'rooks';
import { connect } from 'react-redux';
import { fetchAProfile } from '../actions';
import { updateProfile } from '../actions';
import { createProfile } from '../actions';
import { deleteProfile } from '../actions';
import history from '../history';
const UserProfile = ({
  fetchAProfile,
  user,
  usr,
  updateProfile,
  createProfile,
  deleteProfile,
  isSignedIn,
}) => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [readonly, setReadonly] = useState(false);
  const [first, setFirst] = useState(true);
  const [bio, setBio] = useState('');

  useEffectOnceWhen(() => {
    if (isSignedIn) {
      history.push(`/profile/${usr}`);
      return;
    }
    history.push('/');
  }, !id && isSignedIn !== null);

  useEffect(() => {
    if (user[id]) {
      setName(user[id].name);
      setProfile(user[id].avatar);
      setBio(user[id].bio);
      setFirst(false);
      setReadonly(id !== usr);
    } else {
      fetchAProfile(id);
    }
  }, [id, user]);
  const handleSubmit = () => {
    const data = {
      usr,
      name,
      avatar: profile,
      bio,
    };
    user[id]
      ? updateProfile({ ...data, id: user[id].id })
      : createProfile(data);
  };

  const handleDelete = () => {
    deleteProfile(user[id].id);
  };

  return (
    <>
      <div className="container-center-small">
        <img
          className="ui small image image-big-at-small"
          src={profile || 'https://semantic-ui.com/images/wireframe/image.png'}
        />
      </div>

      <h2 className="ui header center" style={{ textAlign: 'center' }}>
        {readonly ? name : 'Hello User'}
      </h2>
      <div class="ui form">
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Name"
            readOnly={readonly}
          />
        </div>
        <div class="field">
          <label>Profile Picture URL</label>
          <input
            type="text"
            value={profile}
            onChange={(e) => setProfile(e.currentTarget.value)}
            placeholder="Name"
            readOnly={readonly}
          />
        </div>
        <div class="field">
          <label>Bio</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.currentTarget.value)}
            placeholder="Last Name"
            readOnly={readonly}
          />
        </div>
        {!readonly && (
          <>
            <button class="ui button" onClick={handleSubmit} type="submit">
              Submit
            </button>
            {!first && (
              <button
                class="ui red button"
                onClick={handleDelete}
                type="submit"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.users,
    usr: state.auth?.usr,
    isSignedIn: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, {
  fetchAProfile,
  updateProfile,
  createProfile,
  deleteProfile,
})(UserProfile);
