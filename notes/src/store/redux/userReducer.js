import { createAction } from "@reduxjs/toolkit";
import  { produce } from "immer";

export const updateLastActiveDate = createAction(
  "notes/updateLastActiveDate",
  (dateString) => {
    return {
      payload: {
        dateString,
      },
    };
  }
);

// 2) this function gets called
// 3) recreates the users array from scratch
const userReducer = (userData = [], action) => {
  if (action.type === updateLastActiveDate.toString()) {
    return produce(userData, (userData) => {
      console.log("patching userData");
      userData[0].lastActiveDate = action.payload.dateString;
    });

    //

    // if (action.payload.dateString !== currentUser.lastActiveDate) {
    //   const [currentUser, ...otherUsers] = userData;
    //   return [
    //     {
    //       ...currentUser,
    //       lastActiveDate: action.payload.dateString,
    //     },
    //     ...otherUsers,
    //   ];
    // }
  }

  return userData;
}; // => state.users

export default userReducer;
