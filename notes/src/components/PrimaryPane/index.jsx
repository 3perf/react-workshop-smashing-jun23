import { unstable_batchedUpdates } from "react-dom";
import { Button } from "@mui/material";
import { useState } from "react";
import fakeApi from "../../utils/fakeApi";
import NoteEditor from "../NoteEditor";
import NoteView from "../NoteView";
import DarkModeSwitcher from "../DarkModeSwitcher";
import ActiveAuthors from "../ActiveAuthors";
import spinner from "./spinner.svg";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  publishNote,
  unpublishNote,
} from "../../store/redux/noteMetadataReducer";

function PrimaryPane({ activeNoteId, notes, saveNote }) {
  // const [isLoading, setIsLoading] = useState(false); // → 1
  // const [isPublic, setIsPublic] = useState(false); // → 2
  // const [publishedAt, setPublishedAt] = useState(null); // → 3

  const isLoading = useSelector((state) => state.noteMetadata.isUpdating);
  const isPublic = useSelector(
    (state) => state.noteMetadata.publicity[activeNoteId]
  );
  const publishedAt = useSelector(
    (state) => state.noteMetadata.publishedDate[activeNoteId]
  );
  const dispatch = useDispatch();

  const togglePublic = async () => {
    if (isPublic) {
      dispatch(unpublishNote(activeNoteId));
    } else {
      dispatch(publishNote(activeNoteId));
    }
  };

  // render 1: hooks 1 and hooks 2 update
  // render 2: hook 3 updates
  // render 3: hook 1 updates

  // ↓

  // render 1: hooks 1 and hooks 2 update
  // render 2: hook 1 and hook 3 updates

  // const togglePublic = async () => {
  // setIsLoading(true);
  // setIsPublic((isPublic) => !isPublic);
  // // isPublic → false
  // if (isPublic) {
  //   await fakeApi.setPublicStatus(false);
  //   setIsLoading(false);
  // } else {
  //   await fakeApi.setPublicStatus(true);
  //   const publishedDate = await fakeApi.getPublishedDate();
  //   // unstable_batchedUpdates(() => {
  //   setPublishedAt(publishedDate.toLocaleTimeString());
  //   // });
  // }
  // setIsLoading(false);
  // };

  // Solutions:
  // 1. reducer → call dispatch() instead of two setState() hooks
  // 2. unstable_batchedUpdates()
  // 3. Update to React 18

  if (!activeNoteId) {
    return (
      <div className="primary-pane__empty-editor">
        <div className="primary-pane__eyes">👀</div>
        <div className="primary-pane__eyes-caption">
          Select a note to start editing
        </div>
      </div>
    );
  }

  return (
    <div className="primary-pane">
      <div className="primary-pane__header">
        <h1 className="primary-pane__header-text">Editor</h1>
        <ActiveAuthors />
        <DarkModeSwitcher />
      </div>

      <div className="primary-pane__content">
        <div className="primary-pane__controls">
          <Button
            variant="outlined"
            onClick={togglePublic}
            disabled={isLoading}
            startIcon={isPublic ? "🤫" : "👀"}
          >
            {isLoading
              ? "Loading..."
              : isPublic
              ? "Make Private"
              : "Make Public"}
          </Button>
          {!isLoading && isPublic && <span>Published at: {publishedAt}</span>}
        </div>
        <NoteEditor
          saveNote={({ text, date }) => saveNote(activeNoteId, { text, date })}
          notes={notes}
          activeNoteId={activeNoteId}
        />
        <div className="primary-pane__view">
          <NoteView text={notes[activeNoteId].text} />
        </div>
      </div>
      <div
        className={
          "primary-pane__spinner-wrapper" +
          (isLoading ? " primary-pane__spinner-wrapper_visible" : "")
        }
      >
        <img className="primary-pane__spinner" src={spinner} alt="" />
      </div>
    </div>
  );
}

PrimaryPane.whyDidYouRender = {
  logOnDifferentValues: true,
};

/*

myReact:
setState = (newState) => {
  updateUi({ newState });
}

*/

/*

React 17:

const updateQueue = [];
let shouldBatchUpdates = false;

setState = (newState) => {
  updateQueue.push(newState);
  if (!shouldBatchUpdates) processUpdateQueue();
}

onClick = (cb) => {
  unstable_batchedUpdates(() => cb())
}

unstable_batchedUpdates = (cb) => {
  shouldBatchUpdates = true;
  cb();
  shouldBatchUpdates = false;
  processUpdateQueue();
}

unstable_batchedUpdates = cb => cb() // React 18

useCallback = (cb) => {
  // DOES NOT FLIP shouldBatchUpdates
}

cb = () => {
  setIsLoading(true);
  setIsPublic((isPublic) => !isPublic);

  doSomeApi((err, result) => {

  });
}

cb = () => {
    setIsLoading(true);
    setIsPublic((isPublic) => !isPublic);

    // isPublic → false
    // if (false) {
    // await fakeApi.setPublicStatus(false);
    // } else {

    fakeApi.setPublicStatus(true).then(() => {
      return fakeApi.getPublishedDate();
    }).then((publishedDate) => {
      setPublishedAt(publishedDate.toLocaleTimeString());
      setIsLoading(false);
    });


    // }

  };

*/

/*

React 18:

const updateQueue = [];

setState = (newState) => {
  updateQueue.push(newState);
  scheduleProcessUpdateQueue();
}

let hasScheduledUpdate = false;
scheduleProcessUpdateQueue = () => {
  if (hasScheduledUpdate) return;
  hasScheduledUpdate = true;

  setTimeout(() => { processUpdateQueue() }, 0);
  // → not only setTimeout; https://3perf.com/talks/react-concurrency/#slide-23
  // → schedules a new task (https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
}

// setState(1)
// setState(2)
// setState(3)
// → updateQueue = [1, 2, 3]

// once all JS exection is over → the browser calls processUpdateQueue()

*/

export default PrimaryPane;
