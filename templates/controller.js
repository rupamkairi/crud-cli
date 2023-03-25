let methods = ["create", "find", "findOne", "update", "delete"];

function generate({ module, router, esm }) {
  if (!router) router = module + "Router";

  let mCap = module[0].toUpperCase() + module.substring(1);
  methods = methods.map((el) => el + mCap);

  let setupImports = importGenerator({ router, module, esm });
  let postMethod = methodGenerator({
    router,
    method: "post",
    service: methods[0],
  });
  let getMethod = methodGenerator({
    router,
    method: "get",
    service: methods[1],
  });
  let getByIdMethod = methodGenerator({
    router,
    method: "get",
    param: ":id",
    service: methods[2],
  });
  let patchMethod = methodGenerator({
    router,
    method: "patch",
    param: ":id",
    service: methods[3],
  });
  let deleteMethod = methodGenerator({
    router,
    method: "delete",
    param: ":id",
    service: methods[4],
  });

  let setupExports = exportGenerator({ router, esm });

  return `
${setupImports}
${postMethod}
${getMethod}
${getByIdMethod}
${patchMethod}
${deleteMethod}
${setupExports}
  `;
}

function importGenerator({ router, module, esm = false }) {
  let expressImport = esm
    ? `import { Router } from 'express'
import { ${methods.join(", ")} } from './${module}.service.js'
`
    : `const { Router } = require('express')
const { ${methods.join(", ")} } = require('./${module}.service')
`;

  expressImport += `
const ${router} = Router();`;

  return `${expressImport}`;
}

function methodGenerator({ method, param = "", service, router, module }) {
  let paramGetter =
    param &&
    `
    let data = {...req.params, ...req.query, ...req.body}`;

  return `
${router}.${method}("/${param}", async (req, res) => {
  try {${paramGetter}
    let result = await ${service}(data)
    res.status(200).json({})
  } catch (error) {
    res.status(400).send(error)
  }
})
  `;
}

function exportGenerator({ router, esm = false }) {
  let exporter = esm ? `export default ` : `module.exports = `;
  return `${exporter} ${router}`;
}

export default {
  generate,
  importGenerator,
  methodGenerator,
  exportGenerator,
};
