# Market Research — Transmission 33

## Research Boundary

This transmission is source-bound to the supplied fact pack and repository. No external market claims are required, so external browsing was not used.

## Facts

- OpenClaw and `sessions_spawn` are approved public technical names.
- Child sessions default to a cheaper model tier; expensive inference is reserved for orchestration and gate verdicts.
- A child session ran independently, wrote an output file, returned `SPAWN-OK`, and was correctly prevented from spawning grandchildren at depth 1.
- The same smoke surfaced an orchestration failure: the parent ended 16 seconds before the child completed, and the completion announcement gave up after three retries.

## Category Expectations

Readers of agent-system architecture need more than an agent count. They need:

1. A definition of what qualifies as a separate agent.
2. Runtime proof that separate work happened.
3. An authority model for spawning, signing, editing, and publishing.
4. Cost allocation across orchestration and execution.
5. Failure behavior when children outlive parents.
6. A mutation protocol that prevents agents from rewriting their own identities.

## Common Weak Patterns

- Role prompts presented as departments.
- One model switching hats and grading its own output.
- Agent diagrams with no session receipts.
- “Autonomy” claims without depth, wait, approval, or publication constraints.
- Cheap-model routing presented only as savings rather than architectural separation.

## Differentiation Opportunity

Unwind can publish the uncomfortable evidence: 14 original charters, zero runtime agents, then one real child spawn that succeeded and still exposed a parenting failure. The admission makes the pattern credible.

## Content Opportunity

Define a reusable identity-to-hands progression:

- charter -> creed -> runtime session -> bounded tools -> artifact -> collection -> gate verdict -> amendment proposal

This becomes useful to builders without exposing infrastructure coordinates, authentication mechanics, channel identifiers, or balances.

## Assumptions

- Readers understand basic agent orchestration but benefit from plain definitions.
- The page should favor a technical proof record over vendor comparison.

