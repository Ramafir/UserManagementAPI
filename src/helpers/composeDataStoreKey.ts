import { DataStore } from "types/DataStore";

export const composeDataStoreKey = (key: DataStore.Key) => {
  const [identifier, keyType] = key;

  const value =
    typeof identifier !== "string" ? identifier.toString() : identifier;

  return `${keyType}-${value}`;
};
