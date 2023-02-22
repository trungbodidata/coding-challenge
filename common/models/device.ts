import DeviceDocument from "@common/types/deviceDocument";
import { getDb } from "../libs/dbClient";

const getDeviceModel = () => getDb().collection<DeviceDocument>("devices");

export default getDeviceModel;
