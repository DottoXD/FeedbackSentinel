import { MongoClient } from "mongodb";

let URL = process.env.MONGODB_URL;

if (!URL) URL = "mongodb://127.0.0.1:27017";
const Client = new MongoClient(URL, {});
Client.connect();

export default Client;

export function Reconnect() {
  Client.connect();
}
