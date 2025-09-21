import { deleteEmail, fetchApi, updateEmail } from "@/api/emails";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { emailObjectType, emailResponse, emailsResponse } from "@/types";
import { areEmailObjectsEqual } from "@/utils";
import { isValidEmail, toastErrorStyle, toastSuccessStyle } from "@/utils/toastConfig";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function EmailDetails({
  open,
  setOpen,
  selectedEmailObj,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedEmailObj: emailObjectType | undefined;
}) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([""]);

  const [isInvalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [isInvalidTag, setInvalidTag] = useState<boolean>(false);

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (selectedEmailObj) {
      setEmail(selectedEmailObj.email);
      setNote(selectedEmailObj.note);
      setTags(selectedEmailObj.tags);
    }
  }, [selectedEmailObj]);

  if (!selectedEmailObj) {
    return;
  }

  const handleUpdateEmailForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
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

    const body = {
      id: selectedEmailObj.id,
      email,
      note,
      tags,
      created_at: selectedEmailObj.created_at,
      updated_at: selectedEmailObj.updated_at,
    };

    if (areEmailObjectsEqual(selectedEmailObj, body)) {
      toast.info("Nothing Changed");
      return;
    }

    // check if email already exist
    if (selectedEmailObj.email != body.email) {
      const existingEmail: emailsResponse = await fetchApi(`/api/emails/search/${body.email}?limit=1&offset=0`);
      if (existingEmail.data.length > 0 && existingEmail.data[0].email == body.email) {
        toast.error("Email alreay exist", toastErrorStyle);
        return;
      }
    }

    const id = toast.loading("Updating email");
    const data: emailsResponse = await updateEmail(body, selectedEmailObj.id);
    toast.dismiss(id);
    if (data.success) {
      toast.success("Email Updated", toastSuccessStyle);
      mutate((key) => typeof key === "string" && (key.startsWith("/api/emails") || key.startsWith("/api/tags")));
    } else {
      toast.error("Error updating email", toastErrorStyle);
    }
  };

  const handleDeleteEmail = async () => {
    const id = toast.loading("Deleting email");
    const data: emailResponse = await deleteEmail(selectedEmailObj.id);
    toast.dismiss(id);
    if (data.success) {
      toast.success("Email deleted", toastSuccessStyle);
      setOpen(false);
      mutate((key) => typeof key === "string" && (key.startsWith("/api/emails") || key.startsWith("/api/tags")));
    } else {
      toast.error("Error deleting email", toastErrorStyle);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdateEmailForm} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                className={`${isInvalidEmail && "border-2 border-red-400"}`}
                value={email}
                onChange={(ele) => setEmail(ele.currentTarget.value)}
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
            <Button
              type="button"
              className="cursor-pointer"
              variant={"destructive"}
              onClick={handleDeleteEmail}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
