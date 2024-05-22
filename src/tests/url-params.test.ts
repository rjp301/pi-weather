import { expect, test } from "bun:test";

test("url params with link", () => {
  const params = new URLSearchParams({
    redirect: "/stations",
  });
  console.log(params.toString());
  expect(params.toString()).toBe("redirect=%2Fstations");
});
