import getTitleById from "./getTitleById.js";

const bulkTitleById = async (titleIds) => {
  titleIds = titleIds.split(",");
  const result = titleIds.map((titleId) => getTitleById(titleId));
  return Promise.all(result).then(result => result);
};

export default bulkTitleById;