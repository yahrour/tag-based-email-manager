import { fetchApi } from "@/api/emails";
import type { emailObjectType, emailsResponse } from "@/types";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import useSwr, { mutate } from "swr";
import EmailDetails from "./EmailDetails";
import { maskEmail } from "@/utils";

export default function EmailList({ tags, hideEmails }: { tags: string[]; hideEmails: boolean }) {
  const [selectedEmailObj, setSelectedEmailObj] = useState<emailObjectType>();
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 100;
  const { data, isLoading, error } = useSwr<emailsResponse>(
    `/api/emails?tags=${tags.join(",")}&limit=${limit}&offset=0`,
    fetchApi
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const loadMore = async () => {
    if (!data) {
      return;
    }
    const offset = data.data.length;
    const query = tags.length
      ? `?tags=${tags.join(",")}&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&offset=${offset}`;
    if (hasMore) {
      const newData: emailsResponse = await fetchApi(`/api/emails${query}`);
      if (newData.data.length < limit) {
        setHasMore(false);
      }
      mutate(
        `/api/emails?tags=${tags.join(",")}&limit=${limit}&offset=0`,
        {
          ...data,
          data: [...data.data, ...newData.data],
        },
        false
      );
    }
  };

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    [data, tags]
  );

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(observerCallback, {
        threshold: 0.8,
      });
      observerRef.current?.observe(loadMoreRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [observerCallback]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  const handleShowEmailDetails = (emailObj: emailObjectType) => {
    setSelectedEmailObj(emailObj);
    setOpen(true);
  };

  return (
    <Fragment>
      <div className="w-full divide-y divide-gray-200">
        {data?.data?.map((emailObj) => (
          <button
            key={emailObj.id}
            className="block w-full cursor-pointer overflow-hidden py-2 pl-4 text-start text-lg hover:bg-gray-50"
            onClick={() => handleShowEmailDetails(emailObj)}
          >
            {hideEmails ? maskEmail(emailObj.email) : emailObj.email}
          </button>
        ))}
      </div>
      <div ref={loadMoreRef}></div>

      {data?.data && data?.data?.length === 0 && !hasMore && (
        <p className="absolute top-[50%] left-[50%] mt-4 translate-x-[-50%] translate-y-[-50%] font-medium text-gray-600">
          No emails
        </p>
      )}

      {selectedEmailObj && (
        <EmailDetails open={open} setOpen={setOpen} selectedEmailObj={selectedEmailObj} />
      )}
    </Fragment>
  );
}
