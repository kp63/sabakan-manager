const post = <Body = any, Response = any>(input: RequestInfo | URL, body: Body, init: Omit<RequestInit, "body"> = {}): Promise<Response> =>
  fetch(input, {
    method: "POST",
    credentials: "same-origin",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    },
    body: JSON.stringify(body),
  }).then(res => res.json());

export default post;
