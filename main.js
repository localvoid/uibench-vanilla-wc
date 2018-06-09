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

      const cell0 = new UITableCell();
      cell0.state = `#${id}`;
      this.appendChild(cell0);

      for (let i = 0; i < props.length; i++) {
        const cell = new UITableCell();
        cell.state = props[i];
        this.appendChild(cell);
      }
    }
  }
}

customElements.define("ui-table-row", UITableRow, { extends: "tr" });

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
        const row = new UITableRow();
        row.state = items[i];
        this._tbody.appendChild(row);
      }
    }
  }
}

customElements.define("ui-table", UITable, { extends: "table" });

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
        const box = new UIAnimBox();
        box.state = items[i];
        this.appendChild(box);
      }
    }
  }
}

customElements.define("ui-anim", UIAnim, { extends: "div" });

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
        const el = n.container ? new UITreeNode() : new UITreeLeaf();
        el.state = n;
        this.appendChild(el);
      }
    }
  }
}

customElements.define("ui-tree-node", UITreeNode, { extends: "ul" });

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
      const el = new UITreeNode();
      el.state = root;
      this.appendChild(el);
    }
  }
}

customElements.define("ui-tree", UITree, { extends: "div" });

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
        el = new UITable();
        el.state = v.table;
      } else if (location === "anim") {
        el = new UIAnim();
        el.state = v.anim;
      } else if (location === "tree") {
        el = new UITree();
        el.state = v.tree;
      }

      if (el) {
        this.appendChild(el);
      }
    }
  }
}

customElements.define("ui-main", UIMain, { extends: "div" });

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
