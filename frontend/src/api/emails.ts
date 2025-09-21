import type { emailObjectType } from "@/types";

export async function fetchApi(url: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`);
  const data = await res.json();
  return data;
}

type emailBodyType = {
  email: string;
  note: string;
  tags: string[];
};

export async function createEmail(body: emailBodyType) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emails`, requestOptions);
  const data = await res.json();
  return data;
}

export async function updateEmail(reqBody: emailObjectType, id: number) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emails/${id}`, requestOptions);
  const data = await res.json();
  return data;
}

export async function deleteEmail(id: number) {
  const requestOptions = {
    method: "DELETE",
  };

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emails/${id}`, requestOptions);
  const data = await res.json();
  return data;
}
