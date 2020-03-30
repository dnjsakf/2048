const status = document.getElementById("status").Status({
  mode: "3x3",
  doms: {
    screen: document.querySelector("#root > .root-wrapper")
  }
});

const board = document.getElementById("board").Board({
  insts: {
    status: status
  }
});