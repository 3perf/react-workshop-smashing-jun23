import { createAction } from "@reduxjs/toolkit";
import fakeApi from "../../utils/fakeApi";

const updatePublicStatus = (noteId, status) => async (dispatch) => {
  await fakeApi.setPublicStatus(status); // → 500 ms
  dispatch(setNotePublicStatus(noteId, status)); // → render 3; selector isPublic
};

const updatePublishedDate = (noteId) => async (dispatch) => {
  const publishedDate = await fakeApi.getPublishedDate(); // → 700 ms
  dispatch(setNotePublishedDate(noteId, publishedDate.toLocaleTimeString()));
  // → render 2; selector publishedAt
};

export const publishNote = (noteId) => async (dispatch) => {
  dispatch(setMetadataUpdating(true)); // → render 1; selector isLoading

  // await Promise.all([
  //   dispatch(updatePublicStatus(noteId, true)),
  //   dispatch(updatePublishedDate(noteId)),
  // ]);

  const [, publishedDate] = await Promise.all([
    fakeApi.setPublicStatus(true),
    fakeApi.getPublishedDate(), // → 700 ms
  ]);

  dispatch(setNotePublicStatus(noteId, true));
  dispatch(setNotePublishedDate(noteId, publishedDate.toLocaleTimeString()));
  dispatch(setMetadataUpdating(false)); // → render 4; selector isLoading
};

export const unpublishNote = (noteId) => async (dispatch) => {
  dispatch(setMetadataUpdating(true));

  await dispatch(updatePublicStatus(noteId, false));

  dispatch(setMetadataUpdating(false));
};

const setMetadataUpdating = createAction(
  "notes/setMetadataUpdating",
  (isUpdating) => {
    return {
      payload: {
        isUpdating,
      },
    };
  }
);

const setNotePublicStatus = createAction(
  "notes/setPublicStatus",
  (noteId, status) => {
    return {
      payload: {
        noteId,
        status,
      },
    };
  }
);

const setNotePublishedDate = createAction(
  "notes/setPublishedDate",
  (noteId, publishedDate) => {
    return {
      payload: {
        noteId,
        publishedDate,
      },
    };
  }
);

const initialState = {
  isUpdating: false,
  publicity: {},
  publishedDate: {},
};

const noteMetadataReducer = (noteMetadata = initialState, action) => {
  if (action.type === setMetadataUpdating.toString()) {
    return {
      ...noteMetadata,
      isUpdating: action.payload.isUpdating,
    };
  }

  if (action.type === setNotePublicStatus.toString()) {
    return {
      ...noteMetadata,
      publicity: {
        ...noteMetadata.publicity,
        [action.payload.noteId]: action.payload.status,
      },
    };
  }

  if (action.type === setNotePublishedDate.toString()) {
    return {
      ...noteMetadata,
      publishedDate: {
        ...noteMetadata.publicity,
        [action.payload.noteId]: action.payload.publishedDate,
      },
    };
  }

  return noteMetadata;
};

export default noteMetadataReducer;
