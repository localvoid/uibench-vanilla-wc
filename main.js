class UITableCell extends HTMLTableCellElement {
  constructor() {
    super();
    this._state = "";
    this.className = "TableCell";
    this.addEventListener("click", (ev) => {
      console.log(this._state);
      ev.preventDefault();
      ev.stopPropagation();
    });
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      this.textContent = this._state = v;
    }
  }
}

customElements.define("ui-table-cell", UITableCell, { extends: "td" });

function createTableCell(state) {
  const e = document.createElement("td", { is: "ui-table-cell" });
  e.state = state;
  return e;
}

class UITableRow extends HTMLTableRowElement {
  constructor() {
    super();
    this._state = null;
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this.textContent = "";
      }

      const { id, props, active } = v;
      this._state = v;

      this.className = active ? "TableRow active" : "TableRow";
      this.setAttribute("data-id", id);

      this.appendChild(createTableCell(`#${id}`));

      for (let i = 0; i < props.length; i++) {
        this.appendChild(createTableCell(props[i]));
      }
    }
  }
}

customElements.define("ui-table-row", UITableRow, { extends: "tr" });

function createTableRow(state) {
  const e = document.createElement("tr", { is: "ui-table-row" });
  e.state = state;
  return e;
}

class UITable extends HTMLTableElement {
  constructor() {
    super();
    this._state = null;
    this._tbody = document.createElement("tbody");
    this.className = "Table";
    this.appendChild(this._tbody);
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this._tbody.textContent = "";
      }

      const { items } = v;
      this._state = v;

      for (let i = 0; i < items.length; i++) {
        this._tbody.appendChild(createTableRow(items[i]));
      }
    }
  }
}

customElements.define("ui-table", UITable, { extends: "table" });

function createTable(state) {
  const e = document.createElement("table", { is: "ui-table" });
  e.state = state;
  return e;
}

class UIAnimBox extends HTMLDivElement {
  constructor() {
    super();
    this._state = null;
    this.className = "AnimBox";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      const { time, id } = v;
      this._state = v;
      this.style = `border-radius:${time % 10}px;` +
        `background:rgba(0,0,0,${0.5 + ((time % 10) / 10)})`;
      this.setAttribute("data-id", id);
    }
  }
}

customElements.define("ui-anim-box", UIAnimBox, { extends: "div" });

function createAnimBox(state) {
  const e = document.createElement("div", { is: "ui-anim-box" });
  e.state = state;
  return e;
}


class UIAnim extends HTMLDivElement {
  constructor() {
    super();
    this._state = null;
    this.className = "Anim";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this.textContent = "";
      }
      const { items } = v;
      this._state = v;

      for (let i = 0; i < items.length; i++) {
        this.appendChild(createAnimBox(items[i]));
      }
    }
  }
}

customElements.define("ui-anim", UIAnim, { extends: "div" });

function createAnim(state) {
  const e = document.createElement("div", { is: "ui-anim" });
  e.state = state;
  return e;
}

class UITreeLeaf extends HTMLLIElement {
  constructor() {
    super();
    this._state = null;
    this.className = "TreeLeaf";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      this._state = v;
      this.textContent = v.id;
    }
  }
}

customElements.define("ui-tree-leaf", UITreeLeaf, { extends: "li" });

function createTreeLeaf(state) {
  const e = document.createElement("li", { is: "ui-tree-leaf" });
  e.state = state;
  return e;
}

class UITreeNode extends HTMLUListElement {
  constructor() {
    super();
    this._state = null;
    this.className = "TreeNode";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this.textContent = "";
      }
      const { children } = v;
      this._state = v;

      for (let i = 0; i < children.length; i++) {
        const n = children[i];
        this.appendChild(n.container ?
          createTreeNode(n) :
          createTreeLeaf(n));
      }
    }
  }
}

customElements.define("ui-tree-node", UITreeNode, { extends: "ul" });

function createTreeNode(state) {
  const e = document.createElement("ul", { is: "ui-tree-node" });
  e.state = state;
  return e;
}

class UITree extends HTMLDivElement {
  constructor() {
    super();
    this._state = null;
    this.className = "Tree";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this.textContent = "";
      }
      const { root } = v;
      this._state = v;
      this.appendChild(createTreeNode(root));
    }
  }
}

customElements.define("ui-tree", UITree, { extends: "div" });

function createTree(state) {
  const e = document.createElement("div", { is: "ui-tree" });
  e.state = state;
  return e;
}

class UIMain extends HTMLDivElement {
  constructor() {
    super();
    this._state = null;
    this.className = "Main";
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (this._state !== v) {
      if (this._state !== null) {
        this.textContent = "";
      }
      const { location } = v;
      this._state = v;

      let el;
      if (location === "table") {
        el = createTable(v.table);
      } else if (location === "anim") {
        el = createAnim(v.anim);
      } else if (location === "tree") {
        el = createTree(v.tree);
        el.state = v.tree;
      }

      if (el) {
        this.appendChild(el);
      }
    }
  }
}

customElements.define("ui-main", UIMain, { extends: "div" });

function createMain(state) {
  const e = document.createElement("div", { is: "ui-main" });
  e.state = state;
  return e;
}

uibench.init("Vanilla[WC]", "1.0.0");

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.querySelector("#App");

  uibench.run(
    (state) => {
      container.textContent = "";
      const el = new UIMain();
      el.state = state;
      container.appendChild(el);
    },
    (samples) => {
      document.body.innerHTML = "<pre>" + JSON.stringify(samples, null, " ") + "</pre>";
    }
  );
});
