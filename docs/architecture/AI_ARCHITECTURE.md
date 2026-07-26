# AI Architecture

- **Merchant Copilot** + **AI Employees** invoke **structured tools** only
- Each tool: JSON schema, permission, risk level, approval policy
- Memory/retrieval scoped to tenant; **no cross-merchant memory**
- **No unrestricted database tool**
- Model routing (optional Codingo later); usage/cost controls; evaluations
- Prompt-injection defenses; full audit of tool calls
