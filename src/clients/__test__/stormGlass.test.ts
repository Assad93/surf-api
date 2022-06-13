import { StormGlass } from "@src/clients/StormGlass";
import axios from "axios";
import stormGlassResponse from "@test/fixtures/stormglass_response_example.json";
import stormGlassNormalizedResponse from "@test/fixtures/stormglass_response_normalized_example.json";

jest.mock("axios");

describe("StormGlass client", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.145767;
    const lng = 151.123112;

    mockedAxios.get.mockResolvedValue({ data: stormGlassResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponse);
  });

  it("should exclude incomplete data points", async () => {
    const lat = -33.145767;
    const lng = 151.123112;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2020-04-26T00:00:00+00:00",
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -33.145767;
    const lng = 151.123112;

    mockedAxios.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get a StormGlassResponseError when the StormGlass service responds with error", async () => {
    const lat = -33.145767;
    const lng = 151.123112;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
