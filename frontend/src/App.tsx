import { useState } from "react";
import { Toaster } from "sonner";
import AddEmailDialog from "./components/AddEmailDialog";
import EmailList from "./components/EmailList";
import SearchEmailList from "./components/SearchEmailList";
import TagsList from "./components/TagsList";
import { Input } from "./components/ui/input";

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      <div className="mr-auto mb-4 flex w-full items-center gap-4 max-sm:flex-col sm:max-w-xl">
        <Input
          name="email"
          placeholder="Search for an email"
          aria-label="email input"
          onChange={handleSearchInput}
        />
        <div id="actionBarBtns" className="flex w-full gap-4">
          <AddEmailDialog />
          <TagsList selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
      </div>

      {/* Emails */}
      {email ? <SearchEmailList email={email} /> : <EmailList tags={selectedTags} />}
    </div>
  );
}
