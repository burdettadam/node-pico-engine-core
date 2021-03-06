var _ = require("lodash");
var cocb = require("co-callback");

var assertCTX_keys = function(ctx, keys){
    var std_ctx_keys = [
        "rid",
        "scope",
        "getMyKey",
        "modules",
        "KRLClosure",
        "emit",
        "log",
        "callKRLstdlib",
    ];

    var expected = _.cloneDeep(keys).sort().join(",");
    var actual = _.pullAll(_.keys(ctx), std_ctx_keys).sort().join(",");

    if(actual !== expected){
        throw new Error("Invalid ctx expected " + expected + " but was " + actual);
    }
};

module.exports = function(){
    var args = Array.prototype.slice.call(arguments);
    var fn = args.shift();

    if(process.env.NODE_ENV !== "production"){
        //in development, assert ctx is shaped right
        var ctx = args[0];
        if(!_.has(ctx, "rid")){
            throw new Error("ctx must always have `rid`");
        }
        if(!_.has(ctx, "scope")){
            throw new Error("ctx must always have `scope`");
        }
        if(_.has(ctx, "event")){
            assertCTX_keys(_.omit(ctx, [
                "raiseEvent",//not during select/eval event exp
                "foreach_is_final",//only when doing foreach
            ]), [
                "event",
                "pico_id",
                "rule_name",
            ]);
        }else if(_.has(ctx, "query")){
            assertCTX_keys(ctx, [
                "query",
                "pico_id",
            ]);
        }else{
            assertCTX_keys(ctx, [
                //no extra keys when registering a ruleset
            ]);
        }
    }

    return cocb.promiseRun(function*(){
        return yield fn.apply(null, args);
    });
};
