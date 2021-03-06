ruleset io.picolabs.meta {
  meta {
    name "testing meta module"
    description <<
some description for the meta test module
    >>
    author "meta author"
    shares metaQuery
  }
  global {
    metaQuery = function(){
      {
        "rid": meta:rid,
        "host": meta:host,
        "rulesetName": meta:rulesetName,
        "rulesetDescription": meta:rulesetDescription,
        "rulesetAuthor": meta:rulesetAuthor,
        "rulesetURI": meta:rulesetURI,
        "ruleName": meta:ruleName,
        "eci": meta:eci
      }
    }
  }
  rule meta_event {
    select when meta event;
    send_directive("event") with
      rid = meta:rid
      and
      host = meta:host
      and
      rulesetName = meta:rulesetName
      and
      rulesetDescription = meta:rulesetDescription
      and
      rulesetAuthor = meta:rulesetAuthor
      and
      rulesetURI = meta:rulesetURI
      and
      ruleName = meta:ruleName
      and
      eci = meta:eci
  }
}
