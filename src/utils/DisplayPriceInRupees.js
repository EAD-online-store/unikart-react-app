export const DisplayPriceInRupees = (price) => {
  const formattedPrice = new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
  }).format(price);

  return formattedPrice.replace(/^.*?(\d)/, "Rs. $1");
};

// export const DisplayPriceInRupees = (price) => {
//   return new Intl.NumberFormat("si-LK", {
//     style: "currency",
//     currency: "LKR",
//   }).format(price);
// };
