const characterId = args[0];
const apiResponse = await Functions.makeHttpRequest({
  url: `https://swapi.dev/api/people/${characterId}/`,
});
if (apiResponse.error) {
  throw Error("Request failed");
}
const { data } = apiResponse;
return Functions.encodeString(data.name);
