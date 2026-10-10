const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadSource(relative, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src', relative), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, ...globals });
  return exports;
}

test('every scene relationship points to an existing unique entity', () => {
  const { AGENTS, SKILL_TREE } = loadSource('lib/data.ts');
  const { CITIES } = loadSource('lib/cities.ts');
  for (const records of [AGENTS, SKILL_TREE, CITIES]) {
    assert.equal(new Set(records.map(record => record.id)).size, records.length);
  }
  for (const agent of AGENTS) for (const id of agent.connections) {
    assert.ok(AGENTS.some(record => record.id === id), `Missing agent ${id}`);
  }
  for (const skill of SKILL_TREE) for (const id of skill.prerequisites) {
    assert.ok(SKILL_TREE.some(record => record.id === id), `Missing prerequisite ${id}`);
  }
});

test('city heights and skill progress have valid source bounds', () => {
  const { SKILL_TREE } = loadSource('lib/data.ts');
  const { CITIES } = loadSource('lib/cities.ts');
  for (const city of CITIES) {
    assert.ok(Number.isFinite(city.intensity) && city.intensity >= 0 && city.intensity <= 100);
    assert.ok(city.agents >= 0 && [1, 2, 3].includes(city.tier));
  }
  for (const skill of SKILL_TREE) assert.ok(skill.progress >= 0 && skill.progress <= 100);
});

test('DOM-to-scene selection subscriptions clean up on unmount', () => {
  const window = new EventTarget();
  const { emitSceneSelection, subscribeSceneSelection } = loadSource('lib/scene-selection.ts', { window, CustomEvent });
  const received = [];
  const unsubscribe = subscribeSceneSelection(selection => received.push(selection));
  emitSceneSelection({ kind: 'agent', id: 'coder', source: 'dom' });
  assert.equal(received.length, 1);
  assert.equal(received[0].id, 'coder');
  unsubscribe();
  emitSceneSelection({ kind: 'city', id: 'sf' });
  assert.equal(received.length, 1);
});
