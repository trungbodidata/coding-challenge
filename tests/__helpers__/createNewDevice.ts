import DeviceDetail from "@common/types/deviceDetail";
import handler from "../../pages/api/devices";
import getReqRes from "./getReqRes";

export default async function createNewDevice(
  override?: any
): Promise<DeviceDetail> {
  const [req, res] = getReqRes({
    method: "POST",
    body: {
      id: "/devices/id1",
      deviceModel: "/models/id1",
      name: "Sensor",
      note: "Testing a sensor.",
      serial: "A0400102",
      ...override,
    },
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
      ...override,
    })
  );

  return res.json.mock.calls[0][0];
}
