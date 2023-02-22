import { NextApiRequest, NextApiResponse } from "next";
import withDefaultDb from "@common/middlewares/withDefaultDb";
import withMethods from "@common/middlewares/withMethods";
import getDeviceModel from "@common/models/device";
import AppError from "@common/types/appError";
import DeviceDetail from "@common/types/deviceDetail";

/**
 * @swagger
 * /api/devices/{id}:
 *    get:
 *      summary: Get Device
 *      tags: [Devices]
 *      description: Get a device by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          description: The ID of the device to get.
 *      responses:
 *        '200':
 *          description: Returns the device by ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  data:
 *                     $ref: '#/components/schemas/Device'
 *              example:
 *                id: /devices/id1
 *                deviceModel: /devices/id1
 *                name: Sensor
 *                note: Testing a sensor.
 *                serial: A0400102
 */

export default withDefaultDb(
  withMethods({
    GET: getDevice,
  })
);

async function getDevice(
  req: NextApiRequest,
  res: NextApiResponse<DeviceDetail | AppError>
) {
  const { id } = req.query;
  const deviceModel = getDeviceModel();

  const device = await deviceModel.findOne({
    id,
  });

  if (!device) {
    return res
      .status(404)
      .json({ error: "not_found", message: "Device not found" });
  }

  return res.status(200).json({
    id: device.id,
    deviceModel: device.deviceModel,
    name: device.name,
    note: device.note,
    serial: device.serial,
  });
}
