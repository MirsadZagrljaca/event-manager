import cache from "../../../cache/cache";

const read = (req, res) => {
  res.json(cache);
};

export default { read };
