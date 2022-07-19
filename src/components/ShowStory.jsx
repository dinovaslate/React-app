import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchStories } from '../actions';
import { deleteStory } from '../actions';
import { useDidMount } from 'rooks';
import history from '../history';
import ActionList from './ActionList';
import Modal from '../Modal';
const Story = ({ auth, fetchStories, stories, users, deleteStory }) => {
  useDidMount(() => {
    fetchStories();
  });
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState(null);
  const modalContent = useRef();
  const showModal = (params) => {
    modalContent.current = params;
    setOpenModal(true);
  };
  useEffect(() => {
    action && deleteStory(modalContent.current.id, modalContent.current.title);
    setOpenModal(false);
    setAction(null);
    modalContent.current = null;
  }, [action]);
  return (
    <div style={{ marginTop: '10rem', marginBottom: '100px' }}>
      <h1 className="ui header">Stories</h1>
      <div class="ui relaxed celled list">
        {stories.map(({ id, usr, title, description, story }, index) => (
          <div
            class="item"
            style={{
              display: 'grid',
              gridTemplateColumns: '30px 78%',
              position: 'relative',
            }}
          >
            {auth.usr === usr && (
              <div
                className="right floated content"
                style={{
                  position: 'absolute',
                  inset: '50% 10px auto auto',
                  transform: 'translateY(-50%)',
                  zIndex: '9999',
                  cursor: 'pointer',
                }}
              >
                <i
                  className="ellipsis vertical icon"
                  id={`actionStory@${index}`}
                ></i>
                <ActionList id={`actionStory@${index}`}>
                  <a
                    href="#"
                    onClick={() =>
                      showModal({ id, usr, title, description, story })
                    }
                  >
                    Delete
                  </a>
                  <div onClick={() => history.replace(`/CreateStory?id=${id}`)}>
                    Update
                  </div>
                </ActionList>
              </div>
            )}
            <i class="large book middle aligned icon"></i>
            <div class="content">
              <Link class="header" to={`/ShowStory/${id}`}>
                {title}
              </Link>
              <div class="description" style={{ textAlign: 'justify' }}>
                {description} <br />
                <br />
                {users[usr]?.name ? (
                  <Link to={`/profile/${usr}`} style={{ color: 'blue' }}>
                    Made By {users[usr]?.name}
                  </Link>
                ) : (
                  <div>Made By [Deleted]</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {openModal && (
        <Modal header="Delete this Story" setAction={setAction}>
          <div class="ui relaxed list">
            <div class="item">
              <div class="content">
                <a class="header">{modalContent.current.title}</a>
                <div
                  class="description"
                  style={{ width: '700px', textAlign: 'justify' }}
                >
                  {modalContent.current.story} <br />
                  <br />
                  <div style={{ color: 'blue' }}>
                    Made By {users[modalContent.current.usr].name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {auth.isSignedIn && (
        <Link className="ui right floated button blue" to="/CreateStory">
          Create Story
        </Link>
      )}
    </div>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    stories: Object.values(state.story),
    users: state.users,
  };
};
export default connect(mapStateToProps, { fetchStories, deleteStory })(Story);
