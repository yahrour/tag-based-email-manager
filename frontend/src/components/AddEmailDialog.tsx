import { createEmail } from "@/api/emails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { emailsResponse } from "@/types";
import { isValidEmail, toastErrorStyle, toastSuccessStyle } from "@/utils/toastConfig";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function AddEmailDialog() {
  const [emailInput, setEmailInput] = useState("");
  const [isInvalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [isInvalidTag, setInvalidTag] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

  const [open, setOpen] = useState(false);

  const handleAddEmailForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(emailInput.trim())) {
      toast.error("Invalid Email", toastErrorStyle);
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);

    if (tags.length < 1) {
      toast.error("At Least One Tag", toastErrorStyle);
      setInvalidTag(true);
      return;
    }
    setInvalidTag(false);

    const body = { email: emailInput, note, tags };

    const id = toast.loading("Creating email");
    const data: emailsResponse = await createEmail(body);
    toast.dismiss(id);
    if (data.success) {
      toast.success("Email Created", toastSuccessStyle);
      setEmailInput("");
      setTagInput("");
      setNote("");
      setTags([]);
      setOpen(false);
      mutate((key) => typeof key === "string" && (key.startsWith("/api/emails") || key.startsWith("/api/tags")));
    } else {
      toast.error("Email Not Created", toastErrorStyle);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim().length < 1) {
      toast.error("Invalid Tag", toastErrorStyle);
      setInvalidTag(true);
      return;
    }
    if (tagInput.trim().length > 15) {
      toast.error("Tag Too Long", toastErrorStyle);
      setInvalidTag(true);
      return;
    }
    if (tags.includes(tagInput.trim())) {
      toast.error("Tag Already Exist", toastErrorStyle);
      setInvalidTag(true);
      return;
    }
    setInvalidTag(false);

    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const tag = e.currentTarget.innerText;
    const newTags = tags.filter((ele) => ele != tag);
    setTags(newTags);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="add email">
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddEmailForm} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Email</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                className={`${isInvalidEmail && "border-2 border-red-400"}`}
                value={emailInput}
                onChange={(ele) => setEmailInput(ele.currentTarget.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(ele) => setNote(ele.currentTarget.value)}
              ></Textarea>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tag">Tag</Label>
              <div className="flex items-center justify-start gap-4">
                <Input
                  id="tag"
                  name="tag"
                  className={`flex-1 ${isInvalidTag && "border-2 border-red-400"}`}
                  value={tagInput}
                  onChange={(ele) => setTagInput(ele.currentTarget.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="cursor-pointer"
                  aria-label="add tag"
                  onClick={handleAddTag}
                >
                  <Plus />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags?.map((ele) => (
                  <Badge
                    variant="secondary"
                    key={ele}
                    onClick={handleRemoveTag}
                    className="cursor-pointer"
                  >
                    {ele} <X />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
