import handler from "../pages/api/devices/[id]";
import withTestDb from "./__helpers__/withTestDb";
import getReqRes from "./__helpers__/getReqRes";
import createNewDevice from "./__helpers__/createNewDevice";

describe("getDeviceById", () => {
  it("Should response not found when device does not exist", () =>
    withTestDb(async () => {
      const query = {
        id: "123",
      };
      const [req, res] = getReqRes({
        method: "GET",
        query,
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "not_found",
        message: "Device not found",
      });
    }));

  it("Should get device detail success", () =>
    withTestDb(async () => {
      const device = await createNewDevice();

      const [req, res] = getReqRes({
        method: "GET",
        query: {
          id: device.id,
        },
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: device.id,
          deviceModel: "/models/id1",
          name: "Sensor",
          note: "Testing a sensor.",
          serial: "A0400102",
        })
      );
    }));
});
