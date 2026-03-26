import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/greeting", () => {
    return HttpResponse.json({
      message: "Hello, world!",
      recipient: "World",
    });
  }),
];
