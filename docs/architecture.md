`intune-app-protection-lab` has two layers:

1. analyzer / CLI
   - reads offline synthetic app-protection assignment packets
   - scores missing coverage, exception risk, stale sync, and enforcement drift
   - emits JSON, summary, and markdown outputs
2. operator surface
   - turns the same findings into app-lane, policy-gap, and enforcement-posture views
   - prerenders a static Pages deployment with synthetic sample data only
