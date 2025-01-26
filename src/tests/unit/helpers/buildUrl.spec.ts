import { assert } from "chai";

import { APP } from "@config";

import { buildUrl } from "@helpers/buildUrl";

describe("buildUrl tests", () => {
  const baseUrl = APP.URL;

  it(`should return URL ending with slash`, async () => {
    // Act
    const result = buildUrl(baseUrl, []);

    // Assert
    assert.equal(result.toString(), `${baseUrl}/`);
  });

  it(`should return URL without query params`, async () => {
    // Act
    const result = buildUrl(baseUrl, ["sign-up"], { token: "123" });

    // Assert
    assert.equal(result.toString(), `${baseUrl}/sign-up?token=123`);
  });

  it(`should return URL with query params`, async () => {
    // Act
    const result = buildUrl(baseUrl, ["sign-up"]);

    // Assert
    assert.equal(result.toString(), `${baseUrl}/sign-up`);
  });
});
