# Steps

1. node dist/src/main/requesttoken - Starts puppet to web login
2. node dist/src/main/accesstoken <inputrequesttoken> - pass o/p of prev step as input
3. node dist/src/kite/zerodha <inputaccesstoken> - pass o/p of prev step

# Tests
node dist/test/unit/nfo_spec