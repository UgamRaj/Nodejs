const binarySearch = (nums, target) => {
  nums.sort();
  let s = 0,
    e = nums.length - 1;

  while (s <= e) {
    let m = Math.floor((s + e) / 2);

    if (nums[m] === target) {
      return m;
    } else if (nums[m] < target) {
      s = m + 1;
    } else {
      e = m - 1;
    }
  }

  return -1;
};

module.exports = binarySearch;
