import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";
import withDefaultDb from "@common/middlewares/withDefaultDb";
import withMethods from "@common/middlewares/withMethods";
import getDeviceModel from "@common/models/device";
import AppError from "@common/types/appError";
import DeviceDetail from "@common/types/deviceDetail";
import generateId from "@common/utils/generateId";

/**
 * @swagger
 * components:
 *  schemas:
 *    Device:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        deviceModel:
 *          type: string
 *        name:
 *          type: string
 *        note:
 *          type: string
 *        serial:
 *          type: string
 */

/**
 * @swagger
 * /api/devices:
 *    post:
 *      summary: Create device
 *      tags: [Devices]
 *      description: Create a device
 *      responses:
 *        '201':
 *          description: Device Created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Device'
 *              example:
 *                id: /devices/id1
 *                deviceModel: /devices/id1
 *                name: Sensor
 *                note: Testing a sensor.
 *                serial: A0400102
 *
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Device'
 *            example:
 *              id: /devices/id1
 *              deviceModel: /devices/id1
 *              name: Sensor
 *              note: Testing a sensor.
 *              serial: A0400102
 */

export default withDefaultDb(
  withMethods({
    POST: createNewDevice,
  })
);

const createNewDeviceSchema = z.object({
  id: z.string(),
  deviceModel: z.string(),
  name: z.string(),
  note: z.string(),
  serial: z.string(),
});

async function createNewDevice(
  req: NextApiRequest,
  res: NextApiResponse<DeviceDetail | AppError>
) {
  try {
    // Validate body
    createNewDeviceSchema.parse(req.body);

    const { id, deviceModel: model, name, note, serial } = req.body;

    const deviceModel = getDeviceModel();

    const deviceIdExisting = await deviceModel.findOne({
      id,
    });

    if (deviceIdExisting) {
      return res
        .status(400)
        .json({ error: "id_existed", message: "Device ID existed" });
    }

    const device = {
      id: id,
      deviceModel: model,
      name,
      note,
      serial,
    };

    await deviceModel.insertOne(device);

    res.status(201).json(device);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("[POST api/devices] create_device_error", error);
      return res.status(400).json({
        error: "invalid_input",
        message: "Missing or invalid input",
        errorDetails: error.errors?.map((error) => {
          return {
            code: `${error.code}`,
            message: `${error.message}`,
            field: `${error.path[0]}`,
          };
        }),
      });
    }
    return res.status(500).json({
      error: "error",
      message: "Create new device error",
    });
  }
}
