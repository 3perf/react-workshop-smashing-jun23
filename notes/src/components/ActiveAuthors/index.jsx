import { Avatar, AvatarGroup } from "@mui/material";
import { useSelector } from "react-redux";
import avatar1 from "./avatar1.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.jpg";
import { memo } from "react";
import { createSelector } from "reselect";

// const activeThisMonthSelector = (state) =>
//   state.users.filter(
//     (i) =>
//       new Date(i.lastActiveDate).getFullYear() === 2023 &&
//       new Date(i.lastActiveDate).getMonth() === 5
//   );

/**
const activeThisMonth = useMemo(() => {
  users.filter(
    (i) =>
      new Date(i.lastActiveDate).getFullYear() === 2023 &&
      new Date(i.lastActiveDate).getMonth() === 5
  )
}, [users])
 */

// const users = [];
// let activeDate = "2023-06-01";
// activeThisMonthSelector({ users, activeDate }); // → [] (compute)
// activeThisMonthSelector({ users, activeDate }); // → [] (cached)
// activeDate = "2023-07-01";
// activeThisMonthSelector({ users, activeDate }); // → [] (compute)

// 4) selecting the users array
// and, if users changes, we re-run the filter and re-render the component
const activeThisMonthSelector = createSelector(
  [(state) => state.users],
  (users) => {
    console.log("compute selector", users);
    return users.filter(
      (i) =>
        new Date(i.lastActiveDate).getFullYear() === 2023 &&
        new Date(i.lastActiveDate).getMonth() === 5
    );
  }
);

function ActiveAuthors() {
  const activeThisMonth = useSelector(activeThisMonthSelector);

  // const users = useSelector((state) => state.users);
  // // state.users[0].email -> "hello@world.com" -> "goodbye@world.com"

  // const activeThisMonthCount = users.filter(
  //   (i) =>
  //     new Date(i.lastActiveDate).getFullYear() === 2023 &&
  //     new Date(i.lastActiveDate).getMonth() === 5
  // ).length;

  // const activeThisMonthNames = users
  //   .filter(
  //     (i) =>
  //       new Date(i.lastActiveDate).getFullYear() === 2023 &&
  //       new Date(i.lastActiveDate).getMonth() === 5
  //   )
  //   .map((i) => <span>{i.name}</span>);

  // 1) reselect
  // 2) select only users + filter these users inside the component
  // 3) split into two selectors that would only select primitives
  //    ===

  return (
    <div className="primary-pane__authors">
      <div className="primary-pane__authors-last-active">
        {activeThisMonth.length} users active this month:{" "}
        {activeThisMonth.map((i) => i.name).join(", ")}
      </div>
      <AvatarGroup max={2}>
        <Avatar src={avatar1} />
        <Avatar src={avatar2} />
        <Avatar src={avatar3} />
      </AvatarGroup>
    </div>
  );
}

export default memo(ActiveAuthors);
