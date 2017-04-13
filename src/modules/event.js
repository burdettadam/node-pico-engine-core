var _ = require("lodash");
var λ = require("contra");
var cocb = require("co-callback");
var getArg = require("../getArg");

var toFloat = function(v){
    return parseFloat(v) || 0;
};

var aggregateWrap = function(core, ctx, value_pairs, fn, callback){
    λ.each(value_pairs, function(pair, next){
        var name = pair[0];
        var value = pair[1] === void 0
            ? null//leveldb doesnt support undefined
            : pair[1];
        core.db.updateAggregatorVar(ctx.pico_id, ctx.rule, name, function(val){
            if(ctx.current_state_machine_state === "start"){
                //reset the aggregated values every time the state machine resets
                return [value];
            }else if(ctx.current_state_machine_state === "end"){
                //keep a sliding window every time the state machine hits end again i.e. select when repeat ..
                return _.tail(val.concat([value]));
            }
            return val.concat([value]);
        }, function(err, val){
            if(err) return next(err);
            ctx.scope.set(name, fn(val));
            next();
        });
    }, callback);
};

var aggregators = {
    max: function(values){
        return _.max(_.map(values, toFloat));
    },
    min: function(values){
        return _.min(_.map(values, toFloat));
    },
    sum: function(values){
        return _.reduce(_.map(values, toFloat), function(sum, n){
            return sum + n;
        }, 0);
    },
    avg: function(values){
        var sum = _.reduce(_.map(values, toFloat), function(sum, n){
            return sum + n;
        }, 0);
        return sum / _.size(values);
    },
    push: function(values){
        return values;
    }
};

module.exports = function(core){
    var fns = {
        attrs: function*(ctx, args){
            return _.cloneDeep(ctx.event.attrs);//the user may mutate their copy
        },
        attr: function*(ctx, args){
            var name = getArg(args, "name", 0);
            return ctx.event.attrs[name];
        },
        attrMatches: function*(ctx, args){
            var pairs = getArg(args, "pairs", 0);
            var matches = [];
            var i, j, attr, m, pair;
            for(i = 0; i < pairs.length; i++){
                pair = pairs[i];
                attr = ctx.event.attrs[pair[0]];
                m = pair[1].exec(attr || "");
                if(!m){
                    return undefined;
                }
                for(j = 1; j < m.length; j++){
                    matches.push(m[j]);
                }
            }
            return matches;
        },

        raise: cocb.toYieldable(function(ctx, args, callback){
            var revent = getArg(args, "revent", 0);
            ctx.raiseEvent(revent, callback);
        }),

        //TODO this is technically a RuleAction
        //TODO should this rather return info for event to be signaled?
        //TODO is this allowed other places in the code?
        send: function*(ctx, args){
            var event = getArg(args, "event", 0);
            return {
                type: "event:send",
                event: event
            };
        },
        aggregateEvent: cocb.toYieldable(function(ctx, args, callback){
            var aggregator = getArg(args, "aggregator", 0);
            var value_pairs = getArg(args, "value_pairs", 1);
            if(_.has(aggregators, aggregator)){
                aggregateWrap(core, ctx, value_pairs, aggregators[aggregator], callback);
                return;
            }
            throw new Error("Unsupported aggregator: " + aggregator);
        })
    };
    return {
        def: fns
    };
};
