const root = document.querySelector("#root > .root-wrapper");

const status = document.getElementById("status").Status({
  size: "small"
});
const boardInst = document.getElementById("board").Board({
  size: "small",
  screenSize: {
    width: root.offsetWidth,
    height: root.offsetHeight-50
  },
  resize: true
});
boardInst.setInst("status", status);