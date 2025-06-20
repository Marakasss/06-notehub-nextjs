"use client";

import { useState } from "react";
import css from "./App.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import NoteModal from "@/components/NoteModal/NoteModal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Logo from "@/components/Logo/Logo";

export default function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //FETCHING & SEARCHING NOTES
  const [debounseInputValue] = useDebounce(inputValue, 500);

  const notes = useQuery({
    queryKey: ["notes", debounseInputValue, currentPage],
    queryFn: () => fetchNotes(debounseInputValue, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = notes.data?.totalPages ?? 0;

  const handleSearchChange = (newSearch: string) => {
    setInputValue(newSearch);
    setCurrentPage(1);
  };

  return (
    <>
      <div className={css.app}>
        {/* -------LOADER--------- */}

        {notes.isLoading && <Loader />}

        {/* -------HEADER ELEMENTS--------- */}

        <header className={css.toolbar}>
          <div>
            <SearchBox value={inputValue} onSearch={handleSearchChange} />
          </div>
          <Logo />

          <button
            onClick={() => setIsModalOpen(true)}
            className={css.addbutton}
          >
            Create note +
          </button>
        </header>

        {/* -------NOTELIST--------- */}

        <NoteList notes={notes.data?.notes ?? []} />
        {notes.isError && <ErrorMessage />}
        {totalPages > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* -------NOTE MODAL--------- */}

        {isModalOpen && (
          <NoteModal
            onClose={() => setIsModalOpen(false)}
            children={<NoteForm onClose={() => setIsModalOpen(false)} />}
          />
        )}
      </div>
    </>
  );
}
