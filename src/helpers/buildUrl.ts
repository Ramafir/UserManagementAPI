export const buildUrl = (
  baseUrl: string,
  slugs: string[],
  queryParams?: Record<string, string>
) => {
  let query = "";

  if (queryParams && Object.keys(queryParams).length >= 1) {
    const urlSearchParams = new URLSearchParams(queryParams);

    query = `?${urlSearchParams.toString()}`;
  }

  const filteredSlugs = slugs.filter(slug => !!slug);

  return new URL(`${filteredSlugs.join("/")}${query}`, baseUrl);
};
