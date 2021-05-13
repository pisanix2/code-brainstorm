const ruleDefault = require('./default')
const ruleObject = {}
const actionObject = {}

const register = (rules) => {
  for (const rule of rules) {
    if (ruleObject[rule.name]) {
      throw new Error(`Rule ${rule.name} was exists!`)
    }
    ruleObject[rule.name] = rule.rule
  }
}

const registerAction = (action) => {
  for (const el of action) {
    actionObject[el.id] = {
      action: el
    }
  }
}

const getActionById = (id) => {
  return actionObject[id]
}

const getByName = (name) => {
  return ruleObject[name]
}

module.exports = {
  register,
  registerAction,
  getActionById,
  getByName,
  ruleDefault
}
