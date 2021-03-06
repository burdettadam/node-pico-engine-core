module.exports = {
  "rid": "io.picolabs.engine",
  "rules": {
    "newPico": {
      "name": "newPico",
      "select": {
        "graph": { "engine": { "newPico": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "postlude": {
        "fired": function* (ctx) {
          yield (yield ctx.modules.get(ctx, "engine", "newPico"))(ctx, []);
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "newChannel": {
      "name": "newChannel",
      "select": {
        "graph": { "engine": { "newChannel": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "postlude": {
        "fired": function* (ctx) {
          yield (yield ctx.modules.get(ctx, "engine", "newChannel"))(ctx, [{
              "name": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["name"]),
              "type": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["type"]),
              "pico_id": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["pico_id"])
            }]);
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "removeChannel": {
      "name": "removeChannel",
      "select": {
        "graph": { "engine": { "removeChannel": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "postlude": {
        "fired": function* (ctx) {
          yield (yield ctx.modules.get(ctx, "engine", "removeChannel"))(ctx, [{
              "pico_id": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["pico_id"]),
              "eci": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["eci"])
            }]);
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "installRuleset": {
      "name": "installRuleset",
      "select": {
        "graph": { "engine": { "installRuleset": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "postlude": {
        "fired": function* (ctx) {
          yield (yield ctx.modules.get(ctx, "engine", "installRuleset"))(ctx, [{
              "pico_id": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["pico_id"]),
              "rid": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["rid"]),
              "url": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]),
              "base": yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["base"])
            }]);
        },
        "notfired": undefined,
        "always": undefined
      }
    }
  }
};