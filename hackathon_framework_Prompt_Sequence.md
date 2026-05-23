# MISSION: AI Agent Prompting Sequence

## INSTRUCTIONS FOR THE DEVELOPER
Use these exact prompts sequentially as your master workflow orchestration tool. **Do not execute multiple prompts simultaneously.** Always wait for the AI to completely build out the required step and output its documents before proceeding. If the AI deviates from its files or constraints, force a course correction immediately.

---

### Step 1: The First Principles Deconstruction
*Action: Paste your actual hackathon problem statement into `Problem.md` inside the `[Insert Problem Here]` block. Copy and send the prompt below:*

> **PROMPT 1:**
> "Act as an elite systems architect and engineer. I am providing you with our project blueprint file `Problem.md` and our system development constraints file `Agent_Rules.md`. Read the problem statement thoroughly, apply strict First Principles Reasoning as instructed in `Problem.md`, and output our deep, structural deconstruction analysis. Do not write any code yet. Acknowledge and conform to all guardrails."
> 
> *[Reference or paste `Problem.md` and `Agent_Rules.md` here]*

---

### Step 2: Designing the Solution Architecture
*Action: Read the AI's structural deconstruction carefully. If any core assumption or objective is missing, correct it. Once aligned, copy and send the next prompt:*

> **PROMPT 2:**
> "The problem breakdown is excellent and our root challenge is locked. Now, read the instructions inside `Solution.md`. Based exclusively on our first-principles deconstruction and conforming to our offline-first guardrails in `Agent_Rules.md`, build out our complete Solution Architecture. Focus on system modules, data pipelines, and error mitigation strategies."
>
> *[Reference or paste `Solution.md` here]*

---

### Step 3: Mapping the Tech Stack and Directory Structure
*Action: Review the architecture to ensure it perfectly addresses the problem. Then, proceed to define the actual build environment by copying and sending this prompt:*

> **PROMPT 3:**
> "The solution architecture is locked down. Now, read the attached `Tools_&_File_Structure.md`. Translate our system blueprint into an explicit, highly optimized technical environment. Define our technology stack with clear engineering justifications, output our complete copy-pasteable ASCII directory tree, and provide the file manifest."
>
> *[Reference or paste `Tools_&_File_Structure.md` here]*

---

### Step 4: Building the Modular Execution Roadmap
*Action: Verify the chosen stack and directory tree align with your target platform. Then, prompt the agent to map out the physical implementation roadmap:*

> **PROMPT 4:**
> "Our development environment and file structures are finalized. Now, read `Execution.md`. Synthesize everything we have structured up to this point and generate our hyper-detailed, step-by-step implementation roadmap across all development phases. Ensure each phase includes clear objectives, actionable files, and testing protocols."
>
> *[Reference or paste `Execution.md` here]*

---

### Step 5: Commencing the Development Loop (Iterative Phase Coding)
*Action: Once the roadmap is produced, do not ask the agent to write the entire application. Instead, navigate through the execution plan phase-by-phase using this iterative loop:*

> **PROMPT 5 (Iterative Loop - Adjust Phase Number Accordingly):**
> "We are officially launching code execution. Look at our roadmap in `Execution.md` and our structural guardrails in `Agent_Rules.md`. Generate the full code and configuration updates required strictly for **Phase 1: Foundation, Local Storage, & Schema Setup**. Write complete, non-placeholdered, production-grade files for this phase. Once complete, stop and wait for me to test and verify before we proceed."
