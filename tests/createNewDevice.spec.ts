import handler from "../pages/api/devices";
import withTestDb from "./__helpers__/withTestDb";
import getReqRes from "./__helpers__/getReqRes";
import createNewDevice from "./__helpers__/createNewDevice";

describe("createNewDevice", () => {
  it("Should create a new devices success", () =>
    withTestDb(async () => {
      const body = {
        id: "/devices/id1",
        deviceModel: "/models/id1",
        name: "Sensor",
        note: "Testing a sensor.",
        serial: "A0400102",
      };
      const [req, res] = getReqRes({
        method: "POST",
        body,
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "/devices/id1",
          deviceModel: "/models/id1",
          name: "Sensor",
          note: "Testing a sensor.",
          serial: "A0400102",
        })
      );
    }));

  it("Should return error when device ID existed", () =>
    withTestDb(async () => {
      await createNewDevice({
        id: "id_existed",
      });
      const body = {
        id: "id_existed",
        deviceModel: "/models/id1",
        name: "Sensor",
        note: "Testing a sensor.",
        serial: "A0400102",
      };
      const [req, res] = getReqRes({
        method: "POST",
        body,
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "id_existed",
        message: "Device ID existed",
      });
    }));

  it("Should response error when missing some field or input invalid", () =>
    withTestDb(async () => {
      const body = {
        id: "/devices/id1",
        note: "Testing a sensor.",
        serial: "A0400102",
      };
      const [req, res] = getReqRes({
        method: "POST",
        body,
      });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "invalid_input",
        errorDetails: [
          { code: "invalid_type", field: "deviceModel", message: "Required" },
          { code: "invalid_type", field: "name", message: "Required" },
        ],
        message: "Missing or invalid input",
      });
    }));
});
