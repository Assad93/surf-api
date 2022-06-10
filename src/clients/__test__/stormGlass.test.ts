import { StormGlass } from "@src/clients/StormGlass";
import axios from "axios";
import stormGlassResponse from "@test/fixtures/stormglass_response_example.json";
import stormGlassNormalizedResponse from "@test/fixtures/stormglass_response_normalized_example.json";

jest.mock("axios");

describe("StormGlass client", () => {
  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.145767;
    const lng = 151.123112;

    axios.get = jest.fn().mockResolvedValue(stormGlassResponse);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponse);
  });
});
