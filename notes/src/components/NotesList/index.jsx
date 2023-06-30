import { useMemo, useState, startTransition } from "react";
import { Button, ButtonGroup } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";
import { Virtuoso } from 'react-virtuoso'
import _, { set } from "lodash"

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  // Urgent: updates every time
  const [filterInput, setFilterInput] = useState("");

  // Throttled: updates every 1000ms or Non-urgent: updates in background
  const [filterValue, setFilterValue] = useState("");
  const setFilterValueThrottled = useMemo(() => _.throttle(setFilterValue, 1000, { leading: false, trailing: true }), []);

  const filteredNotes = Object.values(notes)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(({ text }) => {
      if (!filterValue) {
        return true;
      }

      return text.toLowerCase().includes(filterValue.toLowerCase());
    });

    // const filteredNotes = useFilteredNotes(filter) // ← data call

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInput}
          onChange={(value) => {
            setFilterInput(value);
            // setFilterValueThrottled(value);
            startTransition(() => {
              setFilterValue(value);
            });
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        {filteredNotes
          .map(({ id, text, date }) => (
            <NoteButton
              key={id}
              isActive={activeNoteId === id}
              id={id}
              onNoteActivated={onNoteActivated}
              text={text}
              filterText={filterValue}
              date={date}
            />
          ))}
      </div>


      {/* <div className="notes-list__notes">
        <Virtuoso
          totalCount={filteredNotes.length}
          itemContent={(index) => {
            const { id, text, date } = filteredNotes[index];
            return <NoteButton
              key={id}
              isActive={activeNoteId === id}
              id={id}
              onNoteActivated={onNoteActivated}
              text={text}
              filterText={filter}
              date={date}
            />
          }}
        />
      </div> */}

      <div className="notes-list__controls">
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
          >
            + Note
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 300 })}
          >
            + Huge
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
          >
            + 100
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onDeleteAllRequested()}
          >
            Delete all
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default NotesList;
