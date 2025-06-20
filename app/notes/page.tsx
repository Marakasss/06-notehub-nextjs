import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const Notes = async () => {
  const initialNotesData = await fetchNotes("", 1);

  return <NotesClient initialNotesData={initialNotesData} />;
};
export default Notes;
