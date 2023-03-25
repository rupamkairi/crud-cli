let methods = ["create", "find", "findOne", "update", "delete"];

function generate({ module, router, esm }) {
  if (!router) router = module + "Router";

  let mCap = module[0].toUpperCase() + module.substring(1);
  methods = methods.map((el) => el + mCap);

  let setupImports = importGenerator({ esm });
  let createMethod = methodGenerator({ method: methods[0] });
  let findMethod = methodGenerator({ method: methods[1] });
  let findOneMethod = methodGenerator({ method: methods[2] });
  let updateMethod = methodGenerator({ method: methods[3] });
  let deleteMethod = methodGenerator({ method: methods[4] });
  let setupExports = exportGenerator({ esm });

  return `
${setupImports}
${createMethod}
${findMethod}
${findOneMethod}
${updateMethod}
${deleteMethod}
${setupExports}
  `;
}

function importGenerator({ router, esm = false }) {
  let dbImport = ``;

  return `${dbImport}`;
}

function methodGenerator({ method, module }) {
  return `
async function ${method}(data) {
  try {
    let {} = data, result = null
    return result
  } catch (error) {
    console.log("${method}Error", error)
    throw error
  }
}
  `;
}

function exportGenerator({ esm = false }) {
  let exporter = esm ? `export default ` : `module.exports = `;
  return `${exporter} {
  ${methods.join(", ")}
}
  `;
}

export default {
  generate,
  importGenerator,
  methodGenerator,
  exportGenerator,
};
