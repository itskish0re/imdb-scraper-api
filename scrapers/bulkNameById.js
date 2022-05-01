import getNameById from "./getNameById.js";

const bulkNameById = async (nameIds) => {
  nameIds = nameIds.split(",");
  const result = nameIds.map((nameId) => getNameById(nameId));
  return Promise.all(result).then(result => result);
};

export default bulkNameById;