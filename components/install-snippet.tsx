"use client";

import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from "@/components/ui/kibo-ui/snippet";
import { useState } from "react";

const commands = [
  {
    label: "npm",
    code: "npm install @ga1az/react-pixel-motion",
  },
  {
    label: "yarn",
    code: "yarn add @ga1az/react-pixel-motion",
  },
  {
    label: "pnpm",
    code: "pnpm add @ga1az/react-pixel-motion",
  },
  {
    label: "bun",
    code: "bun add @ga1az/react-pixel-motion",
  },
];

const InstallSnippet = () => {
  const [value, setValue] = useState(commands[0].label);
  const activeCommand = commands.find((command) => command.label === value);

  return (
    <div>
      <Snippet value={value} onValueChange={setValue}>
        <SnippetHeader>
          <SnippetTabsList>
            {commands.map((command) => (
              <SnippetTabsTrigger key={command.label} value={command.label}>
                {command.label}
              </SnippetTabsTrigger>
            ))}
          </SnippetTabsList>
          <SnippetCopyButton value={activeCommand?.code ?? ""} />
        </SnippetHeader>
        {commands.map((command) => (
          <SnippetTabsContent
            key={command.label}
            value={command.label}
            className="overflow-x-auto"
          >
            {command.code}
          </SnippetTabsContent>
        ))}
      </Snippet>
    </div>
  );
};

export default InstallSnippet;
