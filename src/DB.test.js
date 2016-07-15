var _ = require("lodash");
var λ = require("contra");
var test = require("tape");
var mkTestPicoEngine = require("./mkTestPicoEngine");

test("DB - write and read", function(t){
  var pe = mkTestPicoEngine();

  λ.series({
    start_db: λ.curry(pe.db.toObj),
    pico0: λ.curry(pe.db.newPico, {}),
    chan1: λ.curry(pe.db.newChannel, {pico_id: "id0", name: "one", type: "t"}),
    rule0: λ.curry(pe.db.addRuleset, {pico_id: "id0", rid: "rs0"}),
    chan2: λ.curry(pe.db.newChannel, {pico_id: "id0", name: "two", type: "t"}),
    end_db: λ.curry(pe.db.toObj),
    rmpico0: λ.curry(pe.db.removePico, "id0"),
    post_del_db: λ.curry(pe.db.toObj)
  }, function(err, data){
    if(err) return t.end(err);

    t.deepEquals(data.start_db, {});

    t.deepEquals(data.end_db, {
      pico: {
        "id0": {
          id: "id0",
          channel: {
            "id1": {
              id: "id1",
              name: "one",
              type: "t"
            },
            "id2": {
              id: "id2",
              name: "two",
              type: "t"
            }
          },
          ruleset: {
            "rs0": {on: true}
          }
        }
      }
    });

    t.deepEquals(data.post_del_db, {});

    t.end();
  });
});

test("DB - registerRuleset", function(t){
  var pe = mkTestPicoEngine();

  var krl_src = "ruleset io.picolabs.cool {}";
  var rid = "io.picolabs.cool";
  var hash = "7d71c05bc934b0d41fdd2055c7644fc4d0d3eabf303d67fb97f604eaab2c0aa1";
  var timestamp = (new Date()).toISOString();

  var expected = {};
  _.set(expected, ["rulesets", "krl", hash], {
    src: krl_src,
    rid: rid,
    timestamp: timestamp
  });
  _.set(expected, ["rulesets", "versions", rid, timestamp, hash], true);

  λ.series({
    start_db: λ.curry(pe.db.toObj),
    install: function(next){
      pe.db.registerRuleset(krl_src, next, timestamp);
    },
    end_db: λ.curry(pe.db.toObj)
  }, function(err, data){
    if(err) return t.end(err);
    t.deepEquals(data.start_db, {});
    t.deepEquals(data.install, hash);
    t.deepEquals(data.end_db, expected);
    t.end();
  });
});

test("DB - enableRuleset", function(t){
  var pe = mkTestPicoEngine();

  var krl_src = "ruleset io.picolabs.cool {}";
  //TODO
  λ.waterfall([
    function(callback){
      pe.db.toObj(callback);
    },
    function(db, callback){
      t.deepEquals(db, {});
      pe.db.registerRuleset(krl_src, callback);
    },
    function(hash, callback){
      pe.db.enableRuleset(hash, function(err){
        callback(err, hash);
      });
    },
    function(hash, callback){
      pe.db.toObj(function(err, db){
        callback(err, db, hash);
      });
    },
    function(db, hash, callback){
      t.deepEquals(_.get(db, [
        "rulesets",
        "enabled",
        "io.picolabs.cool",
        "hash"
      ]), hash);
      pe.db.getEnableRuleset("io.picolabs.cool", function(err, data){
        if(err) return callback(err);
        t.equals(data.src, krl_src);
        t.equals(data.hash, hash);
        t.equals(data.rid, "io.picolabs.cool");
        t.equals(data.timestamp_enable, _.get(db, [
          "rulesets",
          "enabled",
          "io.picolabs.cool",
          "timestamp"
        ]));
        callback();
      });
    }
  ], t.end);
});
