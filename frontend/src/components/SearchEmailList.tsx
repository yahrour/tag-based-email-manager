import { fetchApi } from "@/api/emails";
import type { emailObjectType, emailsResponse } from "@/types";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import useSwr, { mutate } from "swr";
import EmailDetails from "./EmailDetails";

export default function SearchEmailList({ email }: { email: string }) {
  const limit = 100;
  const {
    data: emailsData,
    isLoading,
    error,
  } = useSwr<emailsResponse>(`/api/emails/search/${email}?limit=${limit}&offset=0`, fetchApi);
  const [selectedEmailObj, setSelectedEmailObj] = useState<emailObjectType>();
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const loadMore = async () => {
    if (!emailsData) {
      return;
    }
    const offset = emailsData.data.length;
    const query = `?limit=${limit}&offset=${offset}`;
    if (hasMore) {
      const newEmailsData: emailsResponse = await fetchApi(`/api/emails/search/${email}${query}`);
      if (newEmailsData.data.length < limit) {
        setHasMore(false);
      }
      mutate(
        `/api/emails/search/${email}?limit=${limit}&offset=0`,
        {
          ...newEmailsData,
          data: [...emailsData.data, ...newEmailsData.data],
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
    [emailsData]
  );

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(observerCallback, { threshold: 0.8 });
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [observerCallback]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !emailsData?.success) {
    return <div>No email found</div>;
  }

  const handleShowEmailDetails = (emailObj: emailObjectType) => {
    setSelectedEmailObj(emailObj);
    setOpen(true);
  };

  const emailsObj: emailObjectType[] = emailsData.data;

  return (
    <Fragment>
      <div className="w-full divide-y divide-gray-200 p-4">
        {emailsObj.map((emailObj) => (
          <button
            key={emailObj.id}
            className="block w-full cursor-pointer rounded-md py-2 pl-4 text-start text-lg hover:bg-gray-50"
            onClick={() => handleShowEmailDetails(emailObj)}
          >
            {emailObj.email}
          </button>
        ))}
        {emailsObj.length == 0 && <div>No Email Found</div>}
      </div>
      <div ref={loadMoreRef}></div>
      {selectedEmailObj && (
        <EmailDetails open={open} setOpen={setOpen} selectedEmailObj={selectedEmailObj} />
      )}
    </Fragment>
  );
}
