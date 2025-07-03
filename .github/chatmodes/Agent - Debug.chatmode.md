# Copilot Custom Modes Configuration

modes:
  - name: Ask
    description: 'Provides answers to user questions, assists with troubleshooting, and explains code or concepts clearly.'
    tools: [ 'search', 'explain', 'reference' ]

  - name: Edit
    description: 'Edits and refactors code, applies fixes, and implements user-requested changes across files and modules.'
    tools: [ 'edit', 'refactor', 'write', 'find-replace' ]

  - name: Agent
    description: 'Acts as a coding agent: automates workflows, runs scripts, deploys, manages files, and executes terminal commands as needed.'
    tools: [ 'terminal', 'deploy', 'file-manager', 'automation', 'workflow' ]
    