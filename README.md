# Ingrate Log Enhancer

> Provides `log` functions to all actors

## Example

```javascript
const system = createActorSystem({
  enhancers: [createLogEnhancer("main")],
});

system.register(RootActor);
system.dispatch(system.spawn.root(RootActor), { type: "HELLO_WORLD" });

function RootActor({ log, msg }) {
  console.log(msg);
}
```

**Output:** `main Mw9mMOigEx3Xpu30V6gHq2pG RootActor { type: "HELLO_WORLD" }`
