var add = (title, note) => {
  debugger;
  console.log("Adding", title, note);
};

var read = (title) => {
  console.log("Reading", title);
};

var remove = (title) => {
  console.log("Remove", title);
};

var list = () => {
  console.log("Listing");
};

module.exports = {
  add,
  read,
  remove,
  list
}
