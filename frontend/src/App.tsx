import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import AddEmailDialog from "./components/AddEmailDialog";
import EmailList from "./components/EmailList";
import SearchEmailList from "./components/SearchEmailList";
import TagsList from "./components/TagsList";
import { Input } from "./components/ui/input";

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hideEmails, setHideEmails] = useState(() => {
    try {
      const saved = localStorage.getItem("hideEmails");

      if (saved === null) return false;

      const parsed = JSON.parse(saved);

      return typeof parsed === "boolean" ? parsed : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("hideEmails", JSON.stringify(hideEmails));
  }, [hideEmails]);

  let searchTimeOut: ReturnType<typeof setTimeout>;
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeOut) {
      clearTimeout(searchTimeOut);
    }

    const value = e.currentTarget.value;

    searchTimeOut = setTimeout(() => {
      console.log(value);
      setEmail(value);
    }, 500);
  };

  return (
    <div className="container mx-auto flex min-h-screen w-full flex-col items-center p-4">
      <Toaster />
      {/* Title */}
      <h1 className="mb-14 text-3xl font-bold">Email Dashboard</h1>

      {/* Action Bar */}
      <div className="mr-auto mb-6 flex w-full items-center justify-between gap-4 pl-3">
        <Input
          name="email"
          placeholder="Search for an email"
          aria-label="email input"
          onChange={handleSearchInput}
          className="max-w-xs"
        />
        <div id="actionBarBtns" className="flex w-fit max-w-sm gap-4">
          <AddEmailDialog />
          <TagsList selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          <button
            aria-label="show and hide emails"
            onClick={() => setHideEmails(!hideEmails)}
            className="cursor-pointer"
          >
            {hideEmails ? <img src="/eye-off.svg" alt="eye" /> : <img src="/eye.svg" alt="eye" />}
          </button>
        </div>
      </div>

      {/* Emails */}
      {email ? (
        <SearchEmailList email={email} />
      ) : (
        <EmailList tags={selectedTags} hideEmails={hideEmails} />
      )}
    </div>
  );
}
