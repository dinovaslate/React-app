import React, { useRef, useState, useContext } from "react";
import { connect } from "react-redux";
import { fetchAList } from "../../actions";
import { useDidMount, useEffectOnceWhen, useWillUnmount } from "rooks";
import FlvJs from "flv.js";
import Comments from "../Comments";
import CommentForm from "../CommentForm";
import Context from "../../context/Error";

const StreamShow = ({ stream, fetchAList, match, auth }) => {
  const [err, setErr] = useState(null);
  const VIDEO_REF = useRef();
  const PLAYER_REF = useRef();
  const STREAM_ID = match.params.id;

  useDidMount(() => {
    fetchAList(STREAM_ID);
  });
  const { setGlobalError } = useContext(Context);
  useEffectOnceWhen(() => {
    const player = FlvJs.createPlayer({
      type: "flv",
      url: `http://localhost:8000/live/${STREAM_ID}.flv`,
    });
    player.attachMediaElement(VIDEO_REF.current);
    player.load();
    PLAYER_REF.current = player;
    player.on("error", () => {
      setErr("Can't Display Stream");
    });
  }, stream !== undefined);

  useWillUnmount(() => {
    if (PLAYER_REF.current !== undefined) {
      try {
        PLAYER_REF.current.destroy();
      } catch (e) {
        setGlobalError("Can't Destroy Player: No stream has connected");
      }
    }
  });
  return (
    <>
      {!stream ? (
        <div>Loading...</div>
      ) : (
        <div>
          <video ref={VIDEO_REF} style={{ width: "100%" }} controls />
          {err !== null && (
            <div class="ui message">
              <i class="close icon" onClick={() => setErr(null)}></i>
              <div class="header">{err}</div>
              <p>
                The streamer might have ended his stream or hasn't started the
                stream yet
              </p>
            </div>
          )}
          <h1 style={{ textTransform: "capitalize" }}>{stream.title}</h1>
          <p>{stream.description}</p>
          <Comments streamId={STREAM_ID} />
          {auth && <CommentForm mode="Reply" streamId={STREAM_ID} />}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    stream: state.streams[ownProps.match.params.id],
    auth: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, { fetchAList })(StreamShow);
