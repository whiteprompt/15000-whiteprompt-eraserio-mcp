Here are recommendations for building an MCP Server:
•
Avoid full autogeneration Autogenerating an MCP server directly from an OpenAPI schema is not the optimal approach, even though it's easy and takes less than a minute. It often leads to issues because APIs are designed differently from what LLMs need.
•
Limit the number of tools (reduce context) APIs typically have many endpoints (e.g., Neon's has 75-100), but LLMs perform poorly when choosing from a long list of tools and are less effective with larger context windows. Therefore, if you autogenerate, LLMs will not perform well against your service. The worst thing you can do is give an LLM too much choice.
•
Write tool descriptions specifically for LLMs Existing API descriptions are generally written for humans who can reason and use external resources, but LLMs require directness and more examples.
◦
Structure your descriptions in an organized manner (e.g., using XML as Neon does) to provide LLMs with ample context about each tool and when to use it.
•
Design tools for tasks and actions, not low-level resource management Most APIs are built for developers to perform low-level resource management and automation. LLMs, however, are more human-like and need tools that help them achieve specific goals or complete tasks, not just manage resources.
•
Create purpose-built, higher-level tools for complex workflows Instead of exposing generic, low-level tools (like a run SQL tool for database operations), leverage the opportunity to create multi-step, purpose-built MCP tools. For example, Neon created prepare database migration and complete database migration tools, which LLMs prefer over a generic run SQL tool, especially for complex workflows that might not fit well into a traditional REST API. These can help guide LLMs through processes like testing SQL before applying it to the main database branch.
•
Implement a hybrid approach if starting with autogeneration If you choose to start with autogeneration, do so with the intention to refine it. Autogenerate from your OpenAPI schema, and then remove any non-essential tools.
•
Evaluate and iterate on tool descriptions Continuously assess the quality and effectiveness of your tool descriptions.
•
Write and run evaluations (evals) and tests Since LLMs are non-deterministic, you should write tests (called "evals" in the AI world) to ensure that LLMs are calling the correct tool for the right job. Run these evals frequently (e.g., 100, 1,000, or 10,000 times) and iterate on your tool descriptions based on the results to improve LLM performance.